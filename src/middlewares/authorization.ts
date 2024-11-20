import * as jwt from "jsonwebtoken"
import { config } from "dotenv"
import { dataSource } from "../config/ormconfig";
import { User } from "../entity/User.entity";
import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../models/authenticatedRequest.model";

config();
interface payload {
    id: string
    iat: number
    exp: number
}


const { JWT_SECRET = "" } = process.env
export const authorization = async (req: AuthenticatedRequest, res: any, next: any) => {
    try {

        const token = req.cookies.token
        if (!token) return res.status(401).json({ message: "Unauthorized" })
        // ya el verify decodifica el token
        const payload = jwt.verify(token, JWT_SECRET) as payload
        if (!payload) return res.status(401).json({ message: "Unauthorized" })
        const userSource = dataSource.getRepository(User);
        const user = await userSource.findOne({ where: { id: payload.id } })
        if (!user) return res.status(401).json({ message: "Unauthorized" })
        req.currentUser = user;
        next();
    } catch (error) {
        if (error instanceof Error) return res.status(500).json({ message: error.message })
    }
}