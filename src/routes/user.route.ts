import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authentification } from "../middlewares/authentification";
const userRouter = Router();
userRouter.post("/login", AuthController.login);
userRouter.post("/register", AuthController.register);
userRouter.post("/logout", authentification, AuthController.logout);
userRouter.get("/profile", authentification, AuthController.getProfile);
// Rutas vulnerables (para demo de Semgrep)
userRouter.get("/search", AuthController.searchUsers);
userRouter.post("/debug/calculate", AuthController.debugCalculate);
userRouter.get("/greet", AuthController.greetUser);
userRouter.post("/password-reset", AuthController.requestPasswordReset);
export { userRouter };
