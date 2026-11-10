import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30
  },
  displayName: { type: String, required: true, trim: true, maxlength: 50 }
}, {
  versionKey: false,
  timestamps: true
})

// Colección "users"
const User = mongoose.model("User", userSchema)

export { User }
