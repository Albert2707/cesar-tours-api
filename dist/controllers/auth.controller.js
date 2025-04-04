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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const ormconfig_1 = require("../config/ormconfig");
const User_entity_1 = require("../entity/User.entity");
const bcrypt = __importStar(require("bcrypt"));
const encrypt_1 = require("../helpers/encrypt");
const validateBody_1 = require("../helpers/validateBody");
const { JWT_SECRET = "" } = process.env;
class AuthController {
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { error } = validateBody_1.joiSchemaLogin.validate(req.body);
                if (error)
                    return res.status(400).json({ message: error.details[0].message });
                if (!email || !password)
                    return res.status(400).json({ message: "Missing email or password" });
                const user = yield ormconfig_1.dataSource.getRepository(User_entity_1.User).findOne({ where: { email } });
                if (!user)
                    throw new Error("User or password incorrect");
                const isMatch = yield bcrypt.compare(password, user.password);
                if (!isMatch)
                    return res.status(404).json({ message: "User or password incorrect" });
                const { password: pass, createAt, updateAt } = user, payload = __rest(user, ["password", "createAt", "updateAt"]);
                const token = encrypt_1.Encrypt.generateToken({ id: user.id });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000,
                });
                return res.status(200).json({ message: "Logged in successfully", token });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, password, passwordConfirmation } = req.body;
                const { error } = validateBody_1.joiSchemaRegister.validate(req.body);
                if (error)
                    return res.status(400).json({ message: error.details[0].message });
                const userSource = ormconfig_1.dataSource.getRepository(User_entity_1.User);
                const userIn = yield userSource.findOne({ where: { email } });
                if (userIn)
                    return res.status(400).json({ message: "User already exists" });
                if (password !== passwordConfirmation)
                    throw new Error("Passwords do not match");
                const hashedPassword = yield encrypt_1.Encrypt.encryptpass(password);
                const newUser = userSource.create({ email, name, password: hashedPassword });
                yield userSource.save(newUser);
                return res.status(201).json({ message: "User created successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("token", { httpOnly: true, secure: true });
            return res.status(200).json({ message: "Logged out successfully" });
        });
    }
    static getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.currentUser;
                if (!user)
                    return res.status(401).json({ message: "No tienes permisos para acceder a esta información" });
                const { password } = user, userInfo = __rest(user, ["password"]);
                return res.status(200).json({ user: userInfo });
            }
            catch (error) {
                if (error instanceof Error)
                    return res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.AuthController = AuthController;
