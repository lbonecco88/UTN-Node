# Node Chat – Backend

API RESTful para una aplicación de chat, hecha con **Node.js**, **Express** y **MongoDB** (Mongoose).
Trabajo Final Integrador del curso _Desarrollo en Node.js_ (Centro de e-Learning UTN BA).

El frontend que consume esta API está en [`../react-chat-frontend`](../react-chat-frontend).

| | URL local |
| --- | --- |
| API | `http://localhost:3000` |
| Frontend | `http://localhost:5173` |

---

## Tecnologías

- **Express 5** – servidor y rutas (los errores de controladores `async` llegan solos al middleware de errores).
- **Mongoose 9** – conexión a MongoDB y modelos.
- **Zod 4** – validación de `body`, `params` y `query` _(bonus)_.
- **dotenv** – variables de entorno _(bonus)_.
- **cors** – permite que el frontend en React consuma la API desde otro dominio.
- **nodemon** – recarga automática en desarrollo.

## Estructura

```
node-chat-backend/
├── src/
│   ├── routes/          # Definición de rutas por recurso
│   │   ├── userRouter.js
│   │   ├── chatRouter.js
│   │   └── messageRouter.js
│   ├── controllers/     # Lógica de cada endpoint
│   │   ├── userControllers.js
│   │   ├── chatControllers.js
│   │   └── messageControllers.js
│   ├── models/          # Esquemas de Mongoose (una colección por modelo)
│   │   ├── userModel.js
│   │   ├── chatModel.js
│   │   └── messageModel.js
│   ├── middlewares/     # Middlewares personalizados
│   │   ├── validate.js      # Valida con Zod
│   │   ├── notFound.js      # 404 para rutas inexistentes
│   │   └── errorHandler.js  # Manejo centralizado de errores
│   ├── schemas/         # Esquemas de validación Zod
│   ├── utils/           # AppError y helper de respuestas
│   ├── app.js           # Servidor Express (punto de entrada)
│   └── db.js            # Conexión a MongoDB
├── package.json
├── .env.example
└── README.md
```

## Instalación y ejecución

Requisitos: **Node.js 20+** y **MongoDB** corriendo localmente (`mongodb://localhost:27017`).

```bash
# 1. Entrar a la carpeta e instalar dependencias
cd node-chat-backend
npm install

# 2. Crear el archivo de entorno a partir del ejemplo y completarlo
cp .env.example .env

# 3. Levantar el servidor
npm run dev     # desarrollo (nodemon)
npm start       # producción
```

Si todo está bien se ve en consola:

```
Conectado a MongoDB (node_chat)
Servidor escuchando en el puerto 3000
```

### Variables de entorno

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto del servidor | `3000` |
| `MONGO_URI` | Cadena de conexión a MongoDB | `mongodb://localhost:27017/node_chat` |
| `CORS_ORIGIN` | Orígenes permitidos, separados por coma. `*` permite cualquiera | `http://localhost:5173` |

## Modelo de datos

Tres colecciones separadas en MongoDB:

- **users** – `username` (único, minúsculas), `displayName`.
- **chats** – `participants` (array de `userId`), `isGroup`, `name` (solo grupos), `lastMessage`.
- **messages** – `chatId` (ref. a chat), `userId` (ref. a usuario), `content`.

Todos los documentos tienen `createdAt` y `updatedAt`.

Reglas de negocio:

- Un chat con **2 participantes y sin nombre** es **privado**. Si ya existe un chat privado entre esos dos usuarios, `POST /chats` devuelve el existente en lugar de duplicarlo.
- Un chat con **más de 2 participantes** es un **grupo** y requiere `name`.
- Solo un participante del chat puede enviar mensajes en él.
- Al eliminar un usuario se lo quita de sus chats; los chats que quedan con menos de 2 participantes se eliminan junto con sus mensajes.
- Al eliminar un chat se eliminan sus mensajes.

## Formato de respuesta

**Todas** las respuestas (éxito y error) tienen la misma forma:

```json
{ "success": true, "data": { }, "message": "Texto descriptivo" }
```

```json
{ "success": false, "data": null, "message": "Descripción del error" }
```

## Endpoints

### Usuarios – `/users`

| Método | Ruta | Descripción | Body |
| --- | --- | --- | --- |
| `GET` | `/users` | Lista todos los usuarios | – |
| `GET` | `/users/:id` | Obtiene un usuario | – |
| `POST` | `/users` | Crea un usuario | `{ username, displayName? }` |
| `DELETE` | `/users/:id` | Elimina un usuario | – |

`username`: 3 a 30 caracteres, solo letras, números, `.` y `_` (se guarda en minúsculas). Si no se envía `displayName` se usa el `username`.

### Chats – `/chats`

| Método | Ruta | Descripción | Body |
| --- | --- | --- | --- |
| `GET` | `/chats` | Lista todos los chats (más recientes primero) | – |
| `GET` | `/chats?userId=:id` | Lista los chats en los que participa un usuario | – |
| `GET` | `/chats/:id` | Obtiene un chat | – |
| `POST` | `/chats` | Crea un chat privado o grupal | `{ participants: [userId, ...], name? }` |
| `DELETE` | `/chats/:id` | Elimina un chat y sus mensajes | – |

Los chats se devuelven con `participants` y `lastMessage` populados.

### Mensajes – `/messages`

| Método | Ruta | Descripción | Body |
| --- | --- | --- | --- |
| `GET` | `/messages?chatId=:id` | Historial de un chat (del más viejo al más nuevo) | – |
| `POST` | `/messages` | Envía un mensaje a un chat | `{ chatId, userId, content }` |
| `DELETE` | `/messages/:id` | Elimina un mensaje | – |

Los mensajes se devuelven con `userId` populado (`_id`, `username`, `displayName`).

### Códigos de estado

| Código | Cuándo |
| --- | --- |
| `200` | Operación exitosa (o chat privado que ya existía) |
| `201` | Recurso creado |
| `400` | Datos inválidos (validación Zod), ID mal formado o JSON inválido |
| `403` | El usuario no participa del chat en el que intenta escribir |
| `404` | Recurso o ruta inexistente |
| `409` | `username` duplicado |
| `500` | Error interno |

## Ejemplos de requests y responses

> En los ejemplos `BASE_URL=http://localhost:3000`.

### Crear usuario

```bash
curl -X POST $BASE_URL/users \
  -H "Content-Type: application/json" \
  -d '{ "username": "ana", "displayName": "Ana García" }'
```

`201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "6af38ec179a845d58e3ed14b",
    "username": "ana",
    "displayName": "Ana García",
    "createdAt": "2026-11-10T21:38:09.112Z",
    "updatedAt": "2026-11-10T21:38:09.112Z"
  },
  "message": "Usuario creado"
}
```

Con datos inválidos – `400 Bad Request`:

```json
{
  "success": false,
  "data": null,
  "message": "Datos inválidos - username: debe tener al menos 3 caracteres"
}
```

Con un `username` ya usado – `409 Conflict`:

```json
{ "success": false, "data": null, "message": "Ya existe un registro con ese username" }
```

### Listar usuarios

```bash
curl $BASE_URL/users
```

```json
{
  "success": true,
  "data": [
    { "_id": "6af38ec179a845d58e3ed14b", "username": "ana", "displayName": "Ana García", "createdAt": "...", "updatedAt": "..." },
    { "_id": "6af38ec179a845d58e3ed14c", "username": "beto", "displayName": "Beto Pérez", "createdAt": "...", "updatedAt": "..." }
  ],
  "message": "Usuarios obtenidos"
}
```

### Crear chat privado

```bash
curl -X POST $BASE_URL/chats \
  -H "Content-Type: application/json" \
  -d '{ "participants": ["6af38ec179a845d58e3ed14b", "6af38ec179a845d58e3ed14c"] }'
```

`201 Created` (o `200` con `"message": "El chat privado ya existía"`)

```json
{
  "success": true,
  "data": {
    "_id": "6af38ec279a845d58e3ed14e",
    "name": null,
    "isGroup": false,
    "participants": [
      { "_id": "6af38ec179a845d58e3ed14b", "username": "ana", "displayName": "Ana García" },
      { "_id": "6af38ec179a845d58e3ed14c", "username": "beto", "displayName": "Beto Pérez" }
    ],
    "lastMessage": null,
    "createdAt": "2026-11-10T21:38:10.020Z",
    "updatedAt": "2026-11-10T21:38:10.020Z"
  },
  "message": "Chat creado"
}
```

### Crear chat grupal

```bash
curl -X POST $BASE_URL/chats \
  -H "Content-Type: application/json" \
  -d '{ "participants": ["<idAna>", "<idBeto>", "<idCaro>"], "name": "Grupo TP" }'
```

Sin `name` – `400 Bad Request`:

```json
{
  "success": false,
  "data": null,
  "message": "Datos inválidos - name: los chats grupales (más de 2 participantes) necesitan un nombre"
}
```

### Listar chats de un usuario

```bash
curl "$BASE_URL/chats?userId=6af38ec179a845d58e3ed14b"
```

```json
{
  "success": true,
  "data": [
    {
      "_id": "6af38ec279a845d58e3ed14e",
      "name": null,
      "isGroup": false,
      "participants": [ { "_id": "...", "username": "ana", "displayName": "Ana García" }, { "_id": "...", "username": "beto", "displayName": "Beto Pérez" } ],
      "lastMessage": {
        "_id": "6af38ec279a845d58e3ed151",
        "userId": "6af38ec179a845d58e3ed14c",
        "content": "Hola Ana",
        "createdAt": "2026-11-10T21:38:10.250Z"
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "message": "Chats obtenidos"
}
```

### Enviar mensaje

```bash
curl -X POST $BASE_URL/messages \
  -H "Content-Type: application/json" \
  -d '{ "chatId": "6af38ec279a845d58e3ed14e", "userId": "6af38ec179a845d58e3ed14b", "content": "Hola Beto!" }'
```

`201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "6af38ec279a845d58e3ed150",
    "chatId": "6af38ec279a845d58e3ed14e",
    "userId": { "_id": "6af38ec179a845d58e3ed14b", "username": "ana", "displayName": "Ana García" },
    "content": "Hola Beto!",
    "createdAt": "2026-11-10T21:38:10.180Z",
    "updatedAt": "2026-11-10T21:38:10.180Z"
  },
  "message": "Mensaje enviado"
}
```

Si el usuario no es participante – `403 Forbidden`:

```json
{ "success": false, "data": null, "message": "El usuario no participa de este chat" }
```

### Historial de un chat

```bash
curl "$BASE_URL/messages?chatId=6af38ec279a845d58e3ed14e"
```

```json
{
  "success": true,
  "data": [
    { "_id": "...", "chatId": "...", "userId": { "_id": "...", "username": "ana", "displayName": "Ana García" }, "content": "Hola Beto!", "createdAt": "...", "updatedAt": "..." },
    { "_id": "...", "chatId": "...", "userId": { "_id": "...", "username": "beto", "displayName": "Beto Pérez" }, "content": "Hola Ana", "createdAt": "...", "updatedAt": "..." }
  ],
  "message": "Mensajes obtenidos"
}
```

### Eliminar

```bash
curl -X DELETE $BASE_URL/messages/<id>
curl -X DELETE $BASE_URL/chats/<id>
curl -X DELETE $BASE_URL/users/<id>
```

Devuelven el documento eliminado en `data`, o `404` si no existe:

```json
{ "success": false, "data": null, "message": "Chat no encontrado" }
```

## Conexión con el frontend

La API habilita **CORS** para los orígenes de `CORS_ORIGIN`, así que un frontend (React u otro) puede consumirla directamente con `fetch`.
Como todas las respuestas comparten el formato `{ success, data, message }`, alcanza con un único helper:

```js
const API_URL = import.meta.env.VITE_API_URL // ej: http://localhost:3000

const request = async (path, { method = "GET", body } = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message) // mensaje listo para mostrar
  return json.data
}

// Uso
const users = await request("/users")
const chats = await request(`/chats?userId=${users[0]._id}`)
await request("/messages", { method: "POST", body: { chatId: chats[0]._id, userId: users[0]._id, content: "Hola!" } })
```

El frontend de este TP ([`react-chat-frontend`](../react-chat-frontend)) usa exactamente este patrón en `src/api/client.js` y:

1. Lista usuarios (`GET /users`) para elegir con cuál entrar, o crea uno (`POST /users`).
2. Muestra los chats del usuario (`GET /chats?userId=`), refrescándolos cada 4 s.
3. Al abrir un chat pide el historial (`GET /messages?chatId=`) y lo vuelve a pedir cada 3 s (polling) para ver mensajes nuevos de otros usuarios.
4. Envía mensajes con `POST /messages` y crea chats/grupos con `POST /chats`.

Para correr ambos en local:

```bash
# terminal 1
cd node-chat-backend && npm run dev          # http://localhost:3000

# terminal 2
cd react-chat-frontend && npm install && npm run dev   # http://localhost:5173
```
