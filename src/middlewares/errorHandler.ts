import { Request, Response } from "express"

export const ErrorHandler = (error:any, req:Request, res:Response) =>{
     res.status(500).json({message: error.message})
}