import { NextFunction, Request, Response } from "express";
import { dataSource } from "../config/ormconfig";
import { User } from "../entity/User.entity";
import * as bcrypt from "bcryptjs"
import { Encrypt } from "../helpers/encrypt";
import { joiSchemaLogin, joiSchemaRegister } from "../helpers/validateBody";
import { AuthenticatedRequest } from "../models/authenticatedRequest.model";

export class AuthController {
    static async login(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email, password } = req.body;
            const { error } = joiSchemaLogin.validate(req.body)
            if (error) return res.status(400).json({ message: error.details[0].message })
            if (!email || !password) return res.status(400).json({ message: "Missing email or password" });
            const user = await dataSource.getRepository(User).findOne({ where: { email } });
            if (!user) throw new Error("User or password incorrect");
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(404).json({ message: "User or password incorrect" });
            const { password: pass, createAt, updateAt, ...payload } = user;
            const token = Encrypt.generateToken({ id: user.id });
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            }

            )
            return res.status(200).json({ message: "Logged in successfully", token });
        } catch (error) {
            next(error)
        }

    }

    static async register(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email, name, password, passwordConfirmation } = req.body
            const { error } = joiSchemaRegister.validate(req.body)
            if (error) return res.status(400).json({ message: error.details[0].message })
            const userSource = dataSource.getRepository(User)
            const userIn = await userSource.findOne({ where: { email } })
            if (userIn) return res.status(400).json({ message: "User already exists" })
            if (password !== passwordConfirmation) throw new Error("Passwords do not match")
            const hashedPassword = await Encrypt.encryptpass(password)
            const newUser = userSource.create({ email, name, password: hashedPassword });
            await userSource.save(newUser);
            return res.status(201).json({ message: "User created successfully" })
        } catch (error) {
            next(error)
        }
    }

    static async logout(req: Request, res: Response): Promise<any> {
        res.clearCookie("token", { httpOnly: true, secure: true });
        return res.status(200).json({ message: "Logged out successfully" });
    }

    static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            const user = req.currentUser;
            if (!user) return res.status(401).json({ message: "No tienes permisos para acceder a esta información" });
            const { password, ...userInfo } = user;
            return res.status(200).json({ user: userInfo });
        } catch (error) {
            if (error instanceof Error)
                return res.status(500).json({ message: error.message })
        }
    }
}