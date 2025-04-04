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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const ormconfig_1 = require("../config/ormconfig");
const User_entity_1 = require("../entity/User.entity");
const bcrypt = __importStar(require("bcryptjs"));
const encrypt_1 = require("../helpers/encrypt");
const validateBody_1 = require("../helpers/validateBody");
class AuthController {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { error } = validateBody_1.joiSchemaLogin.validate(req.body);
            if (error)
                return res.status(400).json({ message: error.details[0].message });
            if (!email || !password)
                return res.status(400).json({ message: "Missing email or password" });
            const user = await ormconfig_1.dataSource.getRepository(User_entity_1.User).findOne({ where: { email } });
            if (!user)
                throw new Error("User or password incorrect");
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(404).json({ message: "User or password incorrect" });
            const { password: pass, createAt, updateAt, ...payload } = user;
            const token = encrypt_1.Encrypt.generateToken({ id: user.id });
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({ message: "Logged in successfully", token });
        }
        catch (error) {
            next(error);
        }
    }
    static async register(req, res, next) {
        try {
            const { email, name, password, passwordConfirmation } = req.body;
            const { error } = validateBody_1.joiSchemaRegister.validate(req.body);
            if (error)
                return res.status(400).json({ message: error.details[0].message });
            const userSource = ormconfig_1.dataSource.getRepository(User_entity_1.User);
            const userIn = await userSource.findOne({ where: { email } });
            if (userIn)
                return res.status(400).json({ message: "User already exists" });
            if (password !== passwordConfirmation)
                throw new Error("Passwords do not match");
            const hashedPassword = await encrypt_1.Encrypt.encryptpass(password);
            const newUser = userSource.create({ email, name, password: hashedPassword });
            await userSource.save(newUser);
            return res.status(201).json({ message: "User created successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res) {
        res.clearCookie("token", { httpOnly: true, secure: true });
        return res.status(200).json({ message: "Logged out successfully" });
    }
    static async getProfile(req, res, next) {
        try {
            const user = req.currentUser;
            if (!user)
                return res.status(401).json({ message: "No tienes permisos para acceder a esta información" });
            const { password, ...userInfo } = user;
            return res.status(200).json({ user: userInfo });
        }
        catch (error) {
            if (error instanceof Error)
                return res.status(500).json({ message: error.message });
        }
    }
}
exports.AuthController = AuthController;
