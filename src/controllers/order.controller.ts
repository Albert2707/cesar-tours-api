import { NextFunction, Request, Response } from "express";
import { dataSource } from "../config/ormconfig";
import { Order } from "../entity/Order.entity";
import { generateCustomOrderNum } from "../helpers/uuid";
import { Customer } from "../entity/Customer.entity";
import { Vehicle } from "../entity/Vehicles.entity";
import { VehicleState } from "../enums/vehicleEnums";
import { formatToDatabaseDate } from "../utils/functions";
import { Location } from "../entity/Locations";
export class OrderController {
  static getOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { skip = 1, limit = 5, status, reservation_num } = req.query;
      let whereClause: any = {};
      if (status && status !== "all") {
        whereClause.status = Number(status);
      }
      if (reservation_num) {
        whereClause.order_num = reservation_num;
      }
      let skipValue =
        (parseInt(skip as string, 10) - 1) * parseInt(limit as string, 10); // Ajustamos skip
      let limitValue = parseInt(limit as string, 10) || 5;

      const [order, total] = await dataSource
        .getRepository(Order)
        .findAndCount({
          relations: ["customer", "vehicle", "country", "origin", "destination"],
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
      next(error);
    }
  };

  static getOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { id: orderNum } = req.params;
      const order = await dataSource
        .getRepository(Order)
        .createQueryBuilder("order")
        .innerJoinAndSelect("order.customer", "customer")
        .innerJoinAndSelect("order.vehicle", "vehicle")
        .innerJoinAndSelect("order.origin", "origin")
        .innerJoinAndSelect("order.destination", "destination")
        .where("order.order_num = :orderNum", { orderNum })
        .getOne();

      if (!order) {
        throw new Error("Order not found");
      }

      return res.status(200).json({ order });
    } catch (error) {
      next(error);
    }
  };

  static createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const order = dataSource.getRepository(Order);
      const customer = dataSource.getRepository(Customer);
      const { name, lastName, email, phone, optionalPhone, countryId, formatted_origin_address, formatted_destination_address, origin_lat, destination_lat, origin_lng, destination_lng } = req.body;
      req.body;
      const newCustomer = customer.create({
        name,
        lastName,
        email,
        phone,
        optionalPhone,
        countryId,
      });
      const location = dataSource.getRepository(Location)
      const customerCreated = await customer.save(newCustomer);
      const newOriginLocation = location.create({
        formatted_address: formatted_origin_address,
        lat: origin_lat,
        lng: origin_lng,
      })
      const newDestinationLocation = location.create({
        formatted_address: formatted_destination_address,
        lat: destination_lat,
        lng: destination_lng,
      })
      const originLocationCreated = await location.save(newOriginLocation);
      const destinationLocationCreated = await location.save(newDestinationLocation);
      const { location_id: originId } = originLocationCreated;
      const { location_id: destinationId } = destinationLocationCreated;
      const { customer_id: customerId } = customerCreated;

      const body = req.body as Order;
      const { departureDate, returnDate } = body;
      const departure = formatToDatabaseDate(departureDate);
      const returnDateObj = returnDate
        ? formatToDatabaseDate(returnDate)
        : undefined;
      const orderToCreate = {
        ...body,
        departureDate: departure,
        returnDate: returnDateObj,
        order_num: generateCustomOrderNum(),
        customerId,
        originId,
        destinationId,
      };
      const findOrder = await order.findOne({
        where: { order_num: orderToCreate.order_num },
        relations: ["vehicle"],
      });
      if (findOrder)
        return res.status(400).json({ message: "Order already exists" });
      const newOrder = order.create(orderToCreate);
      const orderCreated = await order.save(newOrder);
      const getOrder = await dataSource
        .getRepository(Order)
        .createQueryBuilder("order")
        .innerJoinAndSelect("order.origin", "origin")
        .innerJoinAndSelect("order.destination", "destination")
        .where("order.order_num = :orderNum", { orderNum: orderCreated.order_num })
        .getOne();
      await dataSource
        .getRepository(Vehicle)
        .createQueryBuilder("vehicles")
        .update<Vehicle>(Vehicle, { status: VehicleState.UNAVAILABLE })
        .where("vehicles.id = :id", { id: orderCreated.vehicleId })
        .updateEntity(true)
        .execute();
      return res
        .status(201)
        .json({ message: "Order created successfully", orderCreated: getOrder });
    } catch (error) {
      if (error instanceof Error) next(error);
    }
  };

  static updateOrderStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { id: orderNum } = req.params;
      const { status } = req.body;
      const order = await dataSource
        .getRepository(Order)
        .createQueryBuilder("order")
        .where("order.order_num = :orderNum", { orderNum })
        .getOne();
      const data = {
        status,
      };
      if (!order) throw new Error("Order not found");
      await dataSource.getRepository(Order).save({
        ...order,
        ...data,
      });
      return res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  static deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { orderNum } = req.params;
      await dataSource.getRepository(Order)
        .createQueryBuilder()
        .delete()
        .from(Order)
        .where("order_num = :order_num", { order_num: orderNum })
        .execute();
      return res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

}