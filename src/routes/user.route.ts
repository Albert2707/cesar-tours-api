import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authentification } from "../middlewares/authentification";
const userRouter = Router();
userRouter.post("/login", AuthController.login);
userRouter.post("/register", AuthController.register);
userRouter.post("/logout", authentification, AuthController.logout);
userRouter.get("/profile", authentification, AuthController.getProfile);
export { userRouter };
