import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authentification } from "../middlewares/authentification";

const router = Router();
router.get("/getOrders",authentification, OrderController.getOrders);
router.get("/getOrder/:id",authentification, OrderController.getOrder);
router.put("/updateOrderStatus/:id",authentification, OrderController.updateOrderStatus);
router.post("/createOrder", OrderController.createOrder)
export { router as orderRouter }