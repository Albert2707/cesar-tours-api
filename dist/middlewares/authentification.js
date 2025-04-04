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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentification = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const ormconfig_1 = require("../config/ormconfig");
const User_entity_1 = require("../entity/User.entity");
(0, dotenv_1.config)();
const { JWT_SECRET = "" } = process.env;
const authentification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token)
            return res.status(401).json({ message: "Unauthorized" });
        const payload = jwt.verify(token, JWT_SECRET);
        if (!payload)
            return res.status(401).json({ message: "Unauthorized" });
        const userSource = ormconfig_1.dataSource.getRepository(User_entity_1.User);
        const user = yield userSource.findOne({ where: { id: payload.id } });
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        req.currentUser = user;
        next();
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });
    }
});
exports.authentification = authentification;
