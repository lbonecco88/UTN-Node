import { User } from "../models/userModel.js"
import { Chat } from "../models/chatModel.js"
import { Message } from "../models/messageModel.js"
import { AppError } from "../utils/AppError.js"
import { sendSuccess } from "../utils/response.js"

// GET /users
const getUsers = async (req, res) => {
  const users = await User.find().sort({ displayName: 1 })
  sendSuccess(res, users, "Usuarios obtenidos")
}

// GET /users/:id
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw new AppError("Usuario no encontrado", 404)
  sendSuccess(res, user, "Usuario obtenido")
}

// POST /users
const createUser = async (req, res) => {
  const { username, displayName } = req.body
  const newUser = await User.create({ username, displayName: displayName || username })
  sendSuccess(res, newUser, "Usuario creado", 201)
}

// DELETE /users/:id
// Saca al usuario de sus chats. Los chats que quedan con menos de 2 participantes
// se eliminan junto con sus mensajes.
const deleteUser = async (req, res) => {
  const { id } = req.params

  const deletedUser = await User.findByIdAndDelete(id)
  if (!deletedUser) throw new AppError("Usuario no encontrado", 404)

  await Chat.updateMany({ participants: id }, { $pull: { participants: id } })

  const orphanChats = await Chat.find({ "participants.1": { $exists: false } }).select("_id")
  const orphanIds = orphanChats.map((chat) => chat._id)
  await Message.deleteMany({ chatId: { $in: orphanIds } })
  await Chat.deleteMany({ _id: { $in: orphanIds } })

  sendSuccess(res, deletedUser, "Usuario eliminado")
}

export { getUsers, getUserById, createUser, deleteUser }
