import { Request } from "express";
import { User } from "../entity/User.entity";

export interface AuthenticatedRequest extends Request {
    currentUser?: User;
}