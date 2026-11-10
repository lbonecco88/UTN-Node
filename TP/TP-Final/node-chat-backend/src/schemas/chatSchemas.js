import { z } from "zod"
import { objectId } from "./commonSchemas.js"

const createChatSchema = z.object({
  participants: z.array(objectId, { error: "debe ser una lista de IDs de usuario" })
    .min(2, { error: "un chat necesita al menos 2 participantes" })
    .refine((ids) => new Set(ids).size === ids.length, { error: "no puede haber participantes repetidos" }),
  name: z.string()
    .trim()
    .min(1, { error: "no puede estar vacío" })
    .max(50, { error: "debe tener como máximo 50 caracteres" })
    .optional()
}).refine((chat) => chat.participants.length === 2 || chat.name, {
  error: "los chats grupales (más de 2 participantes) necesitan un nombre",
  path: ["name"]
})

const listChatsQuerySchema = z.object({
  userId: objectId.optional()
})

export { createChatSchema, listChatsQuerySchema }
