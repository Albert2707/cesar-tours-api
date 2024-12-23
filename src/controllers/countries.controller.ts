import { NextFunction, Request, Response } from "express";
import { dataSource } from "../config/ormconfig";
import { Country } from "../entity/Country.entity";
import { CountryDto } from "../dto/country.dto";

export class CountryController {
    static async getCountries(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const countries = await dataSource.getRepository(Country).find();
            const countriesDto:CountryDto[] =countries.map(e=> (
                {country_id:e.country_id,country:e.country}
            ))
            return res.status(200).json(countriesDto);
        } catch (error) {
            next(error)
        }
    }
}