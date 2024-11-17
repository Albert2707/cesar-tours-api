import * as express from "express";
import { VehiclesController } from "../controllers/vehicles.controller";


const router = express.Router();
router.get("/getVehicles/:capacity/:luggage_capacity",VehiclesController.getVehicles);
export  {router as vehicleRouter};