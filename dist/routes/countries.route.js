"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countriesRouter = void 0;
const express_1 = require("express");
const countries_controller_1 = require("../controllers/countries.controller");
const router = (0, express_1.Router)();
exports.countriesRouter = router;
router.get("/getCountries", countries_controller_1.CountryController.getCountries);
