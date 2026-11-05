# TP3 - MongoDB

## Descripción

Esta es el tercer trabajo practico a realizar para la cursada de NodeJS - UTN.

Objetivos:

- Conectar la API en Express a una base de datos MongoDB utilizando Mongoose.
- Definir un esquema y realizar operaciones CRUD básicas.

## Instalación

Instalar Mongoose.
Crear una base de datos en MongoDB y Express con el nombre "utn_node_tp3"

```
npm install
```

## Uso

Ejecutamos la aplicacion y podemos observar por consola los mensajes requeridos.

```
npm run dev
```

| HTTP Method | URL                                  | Description       |
| ----------- | ------------------------------------ | ----------------- |
| `POST`      | http://localhost:1111/users          | Create new User   |
| `PUT`       | http://localhost:1111/users/{userId} | Update User by ID |
| `GET`       | http://localhost:1111/users          | Get All Users     |
| `GET`       | http://localhost:1111/users/{userId} | Get User by ID    |
| `DELETE`    | http://localhost:1111/users/{userId} | Delete User by ID |

POST Body

```
{
    "mail": "mail@gmail.com",
    "dni": 12345678
}
```

PUT Body

```
{
    "name": "Nuevo Nombre"
}

## 🛠️ Tecnologías

[Node](https://nodejs.org/es)
[Express](https://www.npmjs.com/package/express)
[MongoDB](https://www.npmjs.com/package/mongodb)

## 👤 Autor

- **Leonardo Bonecco**
- GitHub: [@lbonecco88](https://github.com/lbonecco88)
- Correo electrónico: lbonecco@gmail.com
```
