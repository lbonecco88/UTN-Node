import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "User Name" },
    mail: { type: String, required: true, unique: true },
    dni: { type: Number, required: true, unique: true },
  },
  { versionKey: false },
);

const User = mongoose.model("User", userSchema);

export { User };
