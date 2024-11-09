import { NextFunction, Request, Response } from "express"

export const validateKey = (req: Request, res: Response, next: NextFunction): void => {

    const key = req.headers["resendapikey"] as string
    if (!key) {
        res.status(401).json({ message: "Debe proporcinonar una clave de API" })
        return
    }
    next();
}
