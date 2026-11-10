import { Router } from "express"
import { getChats, getChatById, createChat, deleteChat } from "../controllers/chatControllers.js"
import { validate } from "../middlewares/validate.js"
import { idParamSchema } from "../schemas/commonSchemas.js"
import { createChatSchema, listChatsQuerySchema } from "../schemas/chatSchemas.js"

const chatRouter = Router()

chatRouter.get("/", validate({ query: listChatsQuerySchema }), getChats)
chatRouter.get("/:id", validate({ params: idParamSchema }), getChatById)
chatRouter.post("/", validate({ body: createChatSchema }), createChat)
chatRouter.delete("/:id", validate({ params: idParamSchema }), deleteChat)

export { chatRouter }
