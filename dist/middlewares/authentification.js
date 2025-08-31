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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentification = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const ormconfig_1 = require("../config/ormconfig");
const User_entity_1 = require("../entity/User.entity");
(0, dotenv_1.config)();
const { JWT_SECRET = "" } = process.env;
const authentification = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token)
            return res.status(401).json({ message: "Unauthorized token not provided" });
        const payload = jwt.verify(token, JWT_SECRET);
        if (!payload)
            return res.status(401).json({ message: "Unauthorized invalid token" });
        const userSource = ormconfig_1.dataSource.getRepository(User_entity_1.User);
        const user = await userSource.findOne({ where: { id: payload.id } });
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        req.currentUser = user;
        next();
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });
    }
};
exports.authentification = authentification;
