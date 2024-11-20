import { NextFunction, Request, Response } from "express";
import { Vehicle } from "../entity/Vehicles.entity";
import { dataSource } from "../config/ormconfig";
import { MoreThanOrEqual } from "typeorm";

export class VehiclesController {
  static getVehicles = async (req: any, res: Response): Promise<any> => {
    try {
      // const user = req["currentUser"];
      const { capacity, luggage_capacity } = req.params;
      const vehicles = await dataSource
        .getRepository(Vehicle)
        .find({
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
}
