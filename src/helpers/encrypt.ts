import * as dotenv from "dotenv"
import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import { payload } from "../dto/user.dto"
dotenv.config()

const { JWT_SECRET = "" } = process.env
export class Encrypt {
    static async encryptpass(password: string) {
        return bcrypt.hash(password, 12);
    }
    static comparepassword(hashPassword: string, password: string) {
        return bcrypt.compare(password, hashPassword)
    }
    static generateToken(payload: payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
    }

}