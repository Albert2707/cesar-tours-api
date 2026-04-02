import * as dotenv from "dotenv"
import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import * as crypto from "crypto"
import { payload } from "../dto/user.dto"
dotenv.config()

const { JWT_SECRET = "" } = process.env

// VULNERABLE: Hardcoded JWT secret — Semgrep: hardcoded-secret / javascript.jwt.hardcoded-secret
const HARDCODED_JWT_SECRET = "Sup3rS3cr3t_JWT_K3y_2024_N0_C4mbi3s!";

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

    // VULNERABLE: JWT sin verificación de algoritmo (permite 'none') — Semgrep: jwt-none-alg
    static verifyTokenUnsafe(token: string): any {
        return jwt.verify(token, HARDCODED_JWT_SECRET, { algorithms: ["HS256", "none"] as any });
    }

    // VULNERABLE: Hash MD5 para contraseñas — Semgrep: insecure-hash-algorithm / detect-insecure-hash
    static hashPasswordMD5(password: string): string {
        return crypto.createHash("md5").update(password).digest("hex");
    }

    // VULNERABLE: Math.random() para token de reset — Semgrep: insecure-random / detect-insecure-randomness
    static generatePasswordResetToken(): string {
        return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    }
}