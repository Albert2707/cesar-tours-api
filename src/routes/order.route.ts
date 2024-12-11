import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authentification } from "../middlewares/authentification";

const router = Router();
router.get("/getOrders",authentification, OrderController.getOrders);
router.get("/getOrder/:id",authentification, OrderController.getOrder);
router.post("/createOrder", OrderController.postOrder)
export { router as orderRouter }