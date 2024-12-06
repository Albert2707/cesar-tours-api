import { Request, Response } from "express";
import { dataSource } from "../config/ormconfig";
import { Order } from "../entity/Order.entity";
import { generateCustomOrderNum } from "../helpers/uuid";
import { Customer } from "../entity/Customer.entity";
export class OrderController {
  static getOrders = async (req: Request, res: Response): Promise<any> => {
    try {
      const { skip = 1, limit = 5, status } = req.query; // Página 1 por defecto
      let whereClause: any = {};

      if (status && status !== "all") {
        whereClause.status = Number(status);
      }
      let skipValue =
        (parseInt(skip as string, 10) - 1) * parseInt(limit as string, 10); // Ajustamos skip
      let limitValue = parseInt(limit as string, 10) || 5;

      const [order, total] = await dataSource
        .getRepository(Order)
        .findAndCount({
          relations: ["customer", "vehicle", "country"],
          skip: skipValue,
          take: limitValue,
          where: whereClause,
          order: {
            createAt: "DESC",
          },
        });

      const currentPage = Math.floor(skipValue / limitValue) + 1;
      const totalPages = Math.ceil(total / limitValue);

      return res.status(200).json({
        order,
        total,
        totalPages,
        currentPage,
        hasNextPage: currentPage < totalPages,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: error.message });
    }
  };

  static postOrder = async (req: Request, res: Response): Promise<any> => {
    try {
      const order = dataSource.getRepository(Order);
      const customer = dataSource.getRepository(Customer);
      const { name, lastName, email, phone, optionalPhone, countryId } =
        req.body;
      const newCustomer = customer.create({
        name,
        lastName,
        email,
        phone,
        optionalPhone,
        countryId,
      });
      const customerCreated = await customer.save(newCustomer);
      const { customer_id: customerId } = customerCreated;

      const body = req.body as Order;
      const orderToCreate = {
        ...body,
        order_num: generateCustomOrderNum(),
        customerId,
      };
      const findOrder = await order.findOne({
        where: { order_num: orderToCreate.order_num },
      });
      if (findOrder)
        return res.status(400).json({ message: "Order already exists" });
      const newOrder = order.create(orderToCreate);
      const orderCreated = await order.save(newOrder);
      return res
        .status(201)
        .json({ message: "Order created successfully", orderCreated });
    } catch (error) {
      if (error instanceof Error)
        return res.status(500).json({ message: error.message });
    }
  };
}
