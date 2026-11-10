import { Chat } from "../models/chatModel.js"
import { User } from "../models/userModel.js"
import { Message } from "../models/messageModel.js"
import { AppError } from "../utils/AppError.js"
import { sendSuccess } from "../utils/response.js"

// Datos relacionados que se devuelven junto a cada chat
const chatPopulate = [
  { path: "participants", select: "username displayName" },
  { path: "lastMessage", select: "content userId createdAt" }
]

// GET /chats?userId=...
// Sin userId lista todos los chats; con userId solo aquellos donde participa.
// Ordenados por actividad (el más reciente primero).
const getChats = async (req, res) => {
  const { userId } = req.query
  const filter = userId ? { participants: userId } : {}

  const chats = await Chat.find(filter).sort({ updatedAt: -1 }).populate(chatPopulate)
  sendSuccess(res, chats, "Chats obtenidos")
}

// GET /chats/:id
const getChatById = async (req, res) => {
  const chat = await Chat.findById(req.params.id).populate(chatPopulate)
  if (!chat) throw new AppError("Chat no encontrado", 404)
  sendSuccess(res, chat, "Chat obtenido")
}

// POST /chats
// 2 participantes sin nombre → chat privado (si ya existe, se devuelve el existente).
// Más de 2 participantes o con nombre → chat grupal.
const createChat = async (req, res) => {
  const { participants, name } = req.body

  const existingUsers = await User.countDocuments({ _id: { $in: participants } })
  if (existingUsers !== participants.length) {
    throw new AppError("Uno o más participantes no existen", 404)
  }

  const isGroup = participants.length > 2 || Boolean(name)

  if (!isGroup) {
    const existingChat = await Chat.findOne({
      isGroup: false,
      participants: { $all: participants, $size: 2 }
    }).populate(chatPopulate)

    if (existingChat) return sendSuccess(res, existingChat, "El chat privado ya existía")
  }

  const newChat = await Chat.create({ participants, isGroup, name: isGroup ? name : null })
  await newChat.populate(chatPopulate)
  sendSuccess(res, newChat, "Chat creado", 201)
}

// DELETE /chats/:id (también elimina sus mensajes)
const deleteChat = async (req, res) => {
  const deletedChat = await Chat.findByIdAndDelete(req.params.id)
  if (!deletedChat) throw new AppError("Chat no encontrado", 404)

  await Message.deleteMany({ chatId: deletedChat._id })
  sendSuccess(res, deletedChat, "Chat eliminado")
}

export { getChats, getChatById, createChat, deleteChat }
