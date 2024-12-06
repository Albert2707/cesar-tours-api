import * as express from "express";
import { VehiclesController } from "../controllers/vehicles.controller";
import { authorization } from "../middlewares/authorization";


const router = express.Router();
router.get("/getVehicles/:capacity/:luggage_capacity", VehiclesController.getVehicles);
router.post("/createVehicle", authorization, VehiclesController.createVehicle);
router.delete("/deleteVehicle/:id", authorization, VehiclesController.deleteVehicle);
export { router as vehicleRouter };