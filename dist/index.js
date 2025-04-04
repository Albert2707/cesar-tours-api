"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const email_route_1 = require("./routes/email.route");
const cors_1 = __importDefault(require("cors"));
const ormconfig_1 = require("./config/ormconfig");
require("reflect-metadata");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const vehicle_route_1 = require("./routes/vehicle.route");
const user_route_1 = require("./routes/user.route");
const order_route_1 = require("./routes/order.route");
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const limiter_1 = require("./middlewares/limiter");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("./helpers/uuid");
const multer_1 = __importDefault(require("multer"));
const errorHandler_1 = require("./middlewares/errorHandler");
const countries_route_1 = require("./routes/countries.route");
const dotenv_1 = require("dotenv");
const maxSize = 5 * 1024 * 1024;
const app = (0, express_1.default)();
const allowedOrigins = ["http://localhost:5173","https://cesar.albertdev.dev","https://cesar-tours-web.onrender.com"];
(0, dotenv_1.config)();
const options = {
    origin: allowedOrigins,
    credentials: true,
};
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/assets/images");
    },
    filename: (req, file, cb) => {
        cb(null, (0, uuid_1.generateCustomOrderNum)() + "-" + file.originalname);
    },
});
app.use((0, multer_1.default)({ storage: fileStorage, limits: { fileSize: maxSize } }).single("image"));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(limiter_1.limiter);
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(options));
app.use((0, express_1.json)());
app.use("/api/email", email_route_1.emailRouter);
app.use("/api/vehicle", vehicle_route_1.vehicleRouter);
app.use("/api/user", user_route_1.userRouter);
app.use("/api/order", order_route_1.orderRouter);
app.use("/api/countries", countries_route_1.countriesRouter);
app.use(errorHandler_1.ErrorHandler);
ormconfig_1.dataSource
    .initialize()
    .then(async () => {
    app.listen(process.env.PORT || 3000, () => {
        console.log("Server is runnnig on port:" + process.env.PORT || 3000);
    });
})
    .catch((err) => {
    throw new Error(err.message);
});
