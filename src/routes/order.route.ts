import { Router } from "express";
import { authorization } from "../middlewares/authorization";
import { OrderController } from "../controllers/order.controller";

const router = Router();
router.get("/getOrders", authorization, OrderController.getOrders);
router.post("/createOrder", OrderController.postOrder)
export { router as orderRouter }