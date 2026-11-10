import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  // Cada mensaje está relacionado con un chat y un usuario
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, trim: true, maxlength: 2000 }
}, {
  versionKey: false,
  timestamps: true
})

// Acelera la consulta del historial de un chat ordenado por fecha
messageSchema.index({ chatId: 1, createdAt: 1 })

// Colección "messages"
const Message = mongoose.model("Message", messageSchema)

export { Message }
