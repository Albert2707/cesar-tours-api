import * as express from "express";
import { VehiclesController } from "../controllers/vehicles.controller";
import { authentification } from "../middlewares/authentification";

const router = express.Router();
router.get(
  "/getVehicles",
  VehiclesController.getVehiclesPublic
);
router.get(
  "/getAllVehicles",
  authentification,
  VehiclesController.getAllVehiclesAdmin
);
router.put("/updateVehicle/:id",authentification,VehiclesController.updateVehicle)
router.post(
  "/createVehicle",
  authentification,
  VehiclesController.createVehicle
);
router.delete(
  "/deleteVehicle/:id",
  authentification,
  VehiclesController.deleteVehicle
);
export { router as vehicleRouter };
