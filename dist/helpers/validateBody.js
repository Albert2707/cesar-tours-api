"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joiSchemaCreateVehicle = exports.joiSchemaLogin = exports.joiSchemaRegister = void 0;
const joi_1 = __importDefault(require("joi"));
exports.joiSchemaRegister = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    name: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    passwordConfirmation: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});
exports.joiSchemaLogin = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});
exports.joiSchemaCreateVehicle = joi_1.default.object({
    brand: joi_1.default.string().required(),
    model: joi_1.default.string().required(),
    capacity: joi_1.default.number().required(),
    luggage_capacity: joi_1.default.number().required(),
    price_per_km: joi_1.default.number().required(),
});
