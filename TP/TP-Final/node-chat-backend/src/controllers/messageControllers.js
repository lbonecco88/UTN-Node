import { Message } from "../models/messageModel.js"
import { Chat } from "../models/chatModel.js"
import { AppError } from "../utils/AppError.js"
import { sendSuccess } from "../utils/response.js"

const authorPopulate = { path: "userId", select: "username displayName" }

// GET /messages?chatId=...
// Historial completo de un chat, del más viejo al más nuevo
const getMessages = async (req, res) => {
  const { chatId } = req.query

  const chatExists = await Chat.exists({ _id: chatId })
  if (!chatExists) throw new AppError("Chat no encontrado", 404)

  const messages = await Message.find({ chatId }).sort({ createdAt: 1 }).populate(authorPopulate)
  sendSuccess(res, messages, "Mensajes obtenidos")
}

// POST /messages
const createMessage = async (req, res) => {
  const { chatId, userId, content } = req.body

  const chat = await Chat.findById(chatId)
  if (!chat) throw new AppError("Chat no encontrado", 404)

  const isParticipant = chat.participants.some((participant) => participant.equals(userId))
  if (!isParticipant) throw new AppError("El usuario no participa de este chat", 403)

  const newMessage = await Message.create({ chatId, userId, content })

  // Guardar el último mensaje actualiza también el updatedAt del chat (orden de la lista)
  chat.lastMessage = newMessage._id
  await chat.save()

  await newMessage.populate(authorPopulate)
  sendSuccess(res, newMessage, "Mensaje enviado", 201)
}

// DELETE /messages/:id
const deleteMessage = async (req, res) => {
  const deletedMessage = await Message.findByIdAndDelete(req.params.id)
  if (!deletedMessage) throw new AppError("Mensaje no encontrado", 404)

  // Si era el último mensaje del chat, se actualiza la referencia al anterior
  const chat = await Chat.findById(deletedMessage.chatId)
  if (chat && chat.lastMessage?.equals(deletedMessage._id)) {
    const previous = await Message.findOne({ chatId: chat._id }).sort({ createdAt: -1 })
    chat.lastMessage = previous ? previous._id : null
    await chat.save()
  }

  sendSuccess(res, deletedMessage, "Mensaje eliminado")
}

export { getMessages, createMessage, deleteMessage }
