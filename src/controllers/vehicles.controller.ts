import { NextFunction, Request, Response } from "express";
import { dataSource } from "../config/ormconfig";
import { MoreThanOrEqual } from "typeorm";
import { Vehicle } from "../entity/Vehicles.entity";
import path from "path";
import fs from "fs";
import { joiSchemaCreateVehicle } from "../helpers/validateBody";
export class VehiclesController {
  static getVehicles = async (req: any, res: Response): Promise<any> => {
    try {
      // const user = req["currentUser"];
      const { capacity, luggage_capacity } = req.params;
      const vehicles = await dataSource.getRepository(Vehicle).find({
        where: {
          status: true,
          capacity: MoreThanOrEqual(+capacity),
          luggage_capacity: MoreThanOrEqual(+luggage_capacity),
        },
      });

      return res.status(200).json(vehicles);
    } catch (err) {
      if (err instanceof Error)
        return res.status(500).json({ message: err.message });
    }
  };

  static async createVehicle(req: Request, res: Response): Promise<any> {
    try {
      const { brand, model, capacity, luggage_capacity, price_per_km } =
        req.body;
      const img = req.file;
      if (!img) return res.status(400).json({ message: "Missing image" });
      const posix = img.path.replace(/\\/g, "/");
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
      console.log(vehicle);
      if (!vehicle)
        return res.status(404).json({ message: "Vehicle not found" });
      // return next(new Error("Error"))
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
