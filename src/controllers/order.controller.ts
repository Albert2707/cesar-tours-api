import { Request, Response } from "express";
import { dataSource } from "../config/ormconfig"
import { Order } from "../entity/Order.entity"

export class OrderController {
    static getOrders = async (req: Request, res: Response): Promise<any> => {
        try {
            const { skip = 0, limit = 5, status } = req.query;
            let whereClause: any = {};

            if (status && status !== 'all') {
                whereClause.status = Number(status);
            }
            const skipValue = parseInt(skip as string, 10) || 0;
            const limitValue = parseInt(limit as string, 10) || 5;
            const [order, total] = await dataSource.getRepository(Order).findAndCount({
                relations: ["customer", "vehicle", "country"],
                skip: skipValue,
                take: limitValue,
                where: whereClause,
                order: {
                    "createAt": "DESC"
                }
            });
            const currentPage =  Math.floor(skipValue / limitValue) + 1  
            const totalPages = Math.ceil(total / limitValue);
            return res.status(200).json({ order, total, totalPages, currentPage, hasNextPage: currentPage < totalPages });
        } catch (error) {
            console.error(error)
            if (error instanceof Error) return res.status(500).json({ message: error.message });
        }
    }
}