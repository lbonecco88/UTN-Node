import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
  // Solo los chats grupales tienen nombre; los privados muestran el nombre del otro usuario
  name: { type: String, trim: true, maxlength: 50, default: null },
  isGroup: { type: Boolean, default: false },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null }
}, {
  versionKey: false,
  timestamps: true
})

chatSchema.index({ participants: 1 })

// Colección "chats"
const Chat = mongoose.model("Chat", chatSchema)

export { Chat }
