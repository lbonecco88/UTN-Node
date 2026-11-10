import { z } from "zod"
import { objectId } from "./commonSchemas.js"

const createMessageSchema = z.object({
  chatId: objectId,
  userId: objectId,
  content: z.string({ error: "es obligatorio" })
    .trim()
    .min(1, { error: "el mensaje no puede estar vacío" })
    .max(2000, { error: "debe tener como máximo 2000 caracteres" })
})

const listMessagesQuerySchema = z.object({
  chatId: objectId
})

export { createMessageSchema, listMessagesQuerySchema }
