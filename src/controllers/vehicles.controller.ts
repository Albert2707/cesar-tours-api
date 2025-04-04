import { NextFunction, Request, Response } from "express";
import { dataSource } from "../config/ormconfig";
import { Brackets, MoreThanOrEqual } from "typeorm";
import { Vehicle } from "../entity/Vehicles.entity";
import path from "path";
import fs from "fs";
import { joiSchemaCreateVehicle } from "../helpers/validateBody";
import { AuthenticatedRequest } from "../models/authenticatedRequest.model";
import { Order } from "../entity/Order.entity";
import { formatDate } from "../utils/functions";
export class VehiclesController {
  static getVehiclesPublic = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { capacity = 1, luggage_capacity = 0, departureDate, returnDate } = req.query;
      const departure = formatDate(departureDate as string);
      const returnDateObj = returnDate ? formatDate(returnDate as string) : null;
      const reservedVehicles = await dataSource
        .getRepository(Order)
        .createQueryBuilder("order")
        .innerJoin("order.vehicle", "vehicle")
        .where("order.vehicle_id = vehicle.id")
        .andWhere(
          new Brackets((qb) => {
            qb.where("order.departureDate = :departureDate", { departureDate: departure })
              .orWhere("order.returnDate = :returnDate", { returnDate: returnDateObj || departure });
          })
        )
        .select("vehicle.id") // Solo necesitamos los IDs de los vehículos reservados
        .getRawMany();

      const reservedVehicleIds = reservedVehicles.map((order) => order.vehicle_id);

      // Paso 2: Obtener vehículos disponibles
      const vehicles = await dataSource.getRepository(Vehicle).find({
        where: {
          capacity: MoreThanOrEqual(+capacity),
          luggage_capacity: MoreThanOrEqual(+luggage_capacity),
        },
      });

      // Paso 3: Filtrar los vehículos reservados
      const availableVehicles = vehicles.filter(
        (vehicle) => !reservedVehicleIds.includes(vehicle.id)
      );

      return res.status(200).json(availableVehicles);
    } catch (err) {
next(err)
    }
  };


  static getAllVehiclesAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { skip = 1, limit = 5, status} = req.query; // Página 1 por defecto
      console.log(status)
      let whereClause: any = {};
      if (status !== "all") {
        whereClause.status = Number(status);
      }
      let skipValue =
        (parseInt(skip as string, 10) - 1) * parseInt(limit as string, 10); // Ajustamos skip
      let limitValue = parseInt(limit as string, 10) || 5;

      const [vehicle, total] = await dataSource
        .getRepository(Vehicle)
        .findAndCount({
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
        vehicle,
        total,
        totalPages,
        currentPage,
        hasNextPage: currentPage < totalPages,
      });
    } catch (error) {
      next(error);
    }
  };

  static getOneVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { id } = req.params;
      const vehicle = dataSource
        .getRepository(Vehicle)
        .createQueryBuilder("vehicle")
        .where("vehicle.id = :id", { id })
        .getOne();
      if (!vehicle) throw new Error("Vehicle not found");
      return res.status(200).json({ vehicle });
    } catch (error) {
      next(error);
    }
  };

  static updateVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { id } = req.params;
      const { brand, model, capacity, luggage_capacity, price_per_km } =
        req.body;
      const img = req.file;
      const posix = img?.path.replace(/\\/g, "/");
      const vehicle = await dataSource
        .getRepository(Vehicle)
        .createQueryBuilder("vehicle")
        .where("vehicle.id = :id", { id })
        .getOne();
      if (!vehicle) throw new Error("Vehicle not found");
      if (img) {
        fs.unlinkSync(path.join(__dirname, "../../" + vehicle.img_url));
      }
      const updateData = {
        brand,
        model,
        capacity,
        luggage_capacity,
        price_per_km,
        img_url: posix ? posix : vehicle?.img_url,
      };
      await dataSource.getRepository(Vehicle).save({
        ...vehicle,
        ...updateData,
      });
      return res.status(200).json({ message: "Vehicle updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  static async createVehicle(req: Request, res: Response): Promise<any> {
    try {
      const { brand, model, capacity, luggage_capacity, price_per_km } =
        req.body;
      const img = req.file;
      if (!img) return res.status(400).json({ message: "Missing image" });
      const posix = img.path.replace(/\\/g, "/");
      console.log(posix)
      console.log(img.path)
      const source = dataSource.getRepository(Vehicle);
      const { error } = joiSchemaCreateVehicle.validate(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });
      const newVehicle = source.create({
        brand,
        model,
        capacity,
        luggage_capacity,
        price_per_km,
        img_url: posix,
      });
      await source.save(newVehicle);
      return res.status(201).json({ message: "Vehicle created successfully" });
    } catch (error) {
      if (error instanceof Error)
        return res.status(500).json({ message: error.message });
    }
  }

  static async deleteVehicle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { id } = req.params;
    try {
      const vehicle = await dataSource
        .getRepository(Vehicle)
        .createQueryBuilder("vehicle")
        .where("vehicle.id = :id", { id })
        .getOne();
      if (!vehicle)
        return res.status(404).json({ message: "Vehicle not found" });
      await dataSource
        .getRepository(Vehicle)
        .createQueryBuilder()
        .delete()
        .from(Vehicle)
        .where("id = :id", { id })
        .execute();
      fs.promises.unlink(path.join(__dirname, "../../" + vehicle.img_url));
      return res.status(200).json({ msg: "good" });
    } catch (error) {
      next(error);
    }
  }
}
