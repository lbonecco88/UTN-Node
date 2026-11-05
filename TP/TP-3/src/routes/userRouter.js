import { Router } from "express";
import { User } from "../models/userModel.js";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const allUsers = await User.find();
  res.json(allUsers);
});

userRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    if (error.name === "UserNotFound") {
      return res.status(404).json({ error: error.message });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid id" });
    }
    res.status(500).json({ error: error.message });
  }
});

userRouter.post("/", async (req, res) => {
  const body = req.body;
  const { name, mail, dni } = body;

  const newUser = {
    name,
    mail,
    dni,
  };

  const savedUser = await User.create(newUser);

  res.json(savedUser);
});

userRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
  res.json(updatedUser);
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);

    res.json(deletedUser);
  } catch (error) {
    if (error.name === "UserNotFound") {
      return res.status(404).json({ error: error.message });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid id" });
    }
    res.status(500).json({ error: error.message });
  }
});

export { userRouter };
