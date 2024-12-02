import { Router } from "express"
import { AuthController } from "../controllers/auth.controller";
import { authorization } from "../middlewares/authorization";
const userRouter = Router();
userRouter.post("/login", AuthController.login)
userRouter.post("/register",authorization, AuthController.register)
userRouter.post("/logout", authorization,AuthController.logout)
userRouter.get("/profile",authorization ,AuthController.getProfile)
export { userRouter }