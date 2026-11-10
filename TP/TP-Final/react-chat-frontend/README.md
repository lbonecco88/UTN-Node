# Node Chat – Frontend

Clon de chat hecho en **React** (Vite) que consume la API de [`node-chat-backend`](../node-chat-backend).

## Funcionalidades

- Elegir con qué usuario entrar, crear usuarios nuevos y eliminarlos.
- Lista de chats del usuario ordenada por actividad, con último mensaje.
- Chats **privados** (1 a 1) y **grupales** (con nombre).
- Historial de mensajes con separadores por día; enviar (Enter) y eliminar mensajes propios.
- Actualización automática por **polling**: chats cada 4 s, mensajes cada 3 s.
- Diseño responsive (en mobile se ve la lista o el chat) y modo oscuro automático.

## Instalación y ejecución

Requisitos: **Node.js 22+** y el backend corriendo.

```bash
cd react-chat-frontend
npm install
cp .env.example .env     # y completar VITE_API_URL
npm run dev              # http://localhost:5173
```

Otros scripts: `npm run build` (genera `dist/`) y `npm run preview`.

### Variables de entorno

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `VITE_API_URL` | URL base del backend, sin barra final | `http://localhost:3000` |

## Estructura

```
src/
├── api/client.js            # fetch + manejo del formato { success, data, message }
├── context/UserContext.jsx  # usuario actual (guardado en localStorage)
├── hooks/usePolling.js      # ejecuta una función cada N ms (con AbortController)
├── pages/
│   ├── SelectUserPage.jsx   # elegir / crear / eliminar usuario
│   └── ChatPage.jsx         # layout: lista de chats + chat abierto
├── components/
│   ├── ChatList.jsx
│   ├── ChatWindow.jsx       # historial, envío y borrado de mensajes
│   ├── NewChatModal.jsx     # crear chat privado o grupo
│   ├── Avatar.jsx
│   └── Icons.jsx
├── utils/chat.js            # títulos de chat y formato de fechas
├── App.jsx                  # rutas: /, /chats, /chats/:chatId
└── main.jsx
```

## Despliegue en Vercel

1. _Add New → Project_ e importar el repositorio de GitHub.
2. **Root Directory:** `TP/TP-Final/react-chat-frontend` (Vercel detecta Vite solo).
3. _Environment Variables_: `VITE_API_URL=https://<servicio>.onrender.com`.
4. Deploy. El archivo `vercel.json` redirige todas las rutas a `index.html` para que funcione recargar en `/chats/:id`.
5. Volver a Render y poner la URL de Vercel en `CORS_ORIGIN` del backend.
