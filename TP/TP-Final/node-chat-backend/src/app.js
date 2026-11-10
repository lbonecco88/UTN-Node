import "dotenv/config"
import express from "express"
import cors from "cors"
import { connectDb } from "./db.js"
import { notFound } from "./middlewares/notFound.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import { userRouter } from "./routes/userRouter.js"
import { chatRouter } from "./routes/chatRouter.js"
import { messageRouter } from "./routes/messageRouter.js"

const app = express()
const PORT = process.env.PORT || 3000

// CORS: permite que el frontend (React) consuma la API desde otro dominio
const allowedOrigins = (process.env.CORS_ORIGIN || "*").split(",").map((o) => o.trim())
app.use(cors({ origin: allowedOrigins.includes("*") ? "*" : allowedOrigins }))

// Parseo de JSON en el body
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ success: true, data: { status: "ok" }, message: "API de chat funcionando" })
})

// Rutas de la API
app.use("/users", userRouter)
app.use("/chats", chatRouter)
app.use("/messages", messageRouter)

// Middlewares de errores (siempre al final)
app.use(notFound)
app.use(errorHandler)

const start = async () => {
  await connectDb()
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
  })
}

start()
