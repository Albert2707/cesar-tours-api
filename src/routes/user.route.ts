import { Router } from "express"
import { AuthController } from "../controllers/auth.controller";
const userRouter = Router();
userRouter.post("/login", AuthController.login)
userRouter.post("/register", AuthController.register)
userRouter.post("/logout", AuthController.logout)
export { userRouter }