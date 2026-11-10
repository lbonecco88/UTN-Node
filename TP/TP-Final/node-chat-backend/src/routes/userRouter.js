import { Router } from "express"
import { getUsers, getUserById, createUser, deleteUser } from "../controllers/userControllers.js"
import { validate } from "../middlewares/validate.js"
import { idParamSchema } from "../schemas/commonSchemas.js"
import { createUserSchema } from "../schemas/userSchemas.js"

const userRouter = Router()

userRouter.get("/", getUsers)
userRouter.get("/:id", validate({ params: idParamSchema }), getUserById)
userRouter.post("/", validate({ body: createUserSchema }), createUser)
userRouter.delete("/:id", validate({ params: idParamSchema }), deleteUser)

export { userRouter }
