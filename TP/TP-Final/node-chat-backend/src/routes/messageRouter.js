import { Router } from "express"
import { getMessages, createMessage, deleteMessage } from "../controllers/messageControllers.js"
import { validate } from "../middlewares/validate.js"
import { idParamSchema } from "../schemas/commonSchemas.js"
import { createMessageSchema, listMessagesQuerySchema } from "../schemas/messageSchemas.js"

const messageRouter = Router()

messageRouter.get("/", validate({ query: listMessagesQuerySchema }), getMessages)
messageRouter.post("/", validate({ body: createMessageSchema }), createMessage)
messageRouter.delete("/:id", validate({ params: idParamSchema }), deleteMessage)

export { messageRouter }
