import * as express from "express";
import { EmailController } from "../controllers/email.controller";
import { validateKey } from "../middlewares/validatekey";

const router = express.Router();
router.post("/send",validateKey,EmailController.postSendEmail);
export  {router as emailRouter};