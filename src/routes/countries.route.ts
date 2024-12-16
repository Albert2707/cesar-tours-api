import { Router } from "express"
import { CountryController } from "../controllers/countries.controller";
import { authentification } from "../middlewares/authentification";

const router = Router();

router.get("/getCountries",CountryController.getCountries)
export {router as countriesRouter}