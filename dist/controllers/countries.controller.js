"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryController = void 0;
const ormconfig_1 = require("../config/ormconfig");
const Country_entity_1 = require("../entity/Country.entity");
class CountryController {
    static async getCountries(req, res, next) {
        try {
            const countries = await ormconfig_1.dataSource.getRepository(Country_entity_1.Country).find();
            const countriesDto = countries.map(e => ({ country_id: e.country_id, country: e.country }));
            return res.status(200).json(countriesDto);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CountryController = CountryController;
