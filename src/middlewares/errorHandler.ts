import { NextFunction, Request, Response } from "express"

export const ErrorHandler = (error: any, req: Request, res: Response, next: NextFunction): any => {
     return res.status(500).json({ message: error.message || 'Something went wrong' });
   };