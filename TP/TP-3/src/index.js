import express from "express";
import { connectDb } from "./config/connectDb.js";
import { userRouter } from "./routes/userRouter.js";

// Servidor HTTP
const server = express();
server.use(express.json());

const PORT = 1111;

server.use("/users", userRouter);

server.listen(PORT, () => {
  connectDb();
});
