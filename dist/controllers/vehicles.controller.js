"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesController = void 0;
const ormconfig_1 = require("../config/ormconfig");
const typeorm_1 = require("typeorm");
const Vehicles_entity_1 = require("../entity/Vehicles.entity");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const validateBody_1 = require("../helpers/validateBody");
const Order_entity_1 = require("../entity/Order.entity");
const functions_1 = require("../utils/functions");
class VehiclesController {
    static createVehicle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { brand, model, capacity, luggage_capacity, price_per_km } = req.body;
                const img = req.file;
                if (!img)
                    return res.status(400).json({ message: "Missing image" });
                const posix = img.path.replace(/\\/g, "/");
                const source = ormconfig_1.dataSource.getRepository(Vehicles_entity_1.Vehicle);
                const { error } = validateBody_1.joiSchemaCreateVehicle.validate(req.body);
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
                yield source.save(newVehicle);
                return res.status(201).json({ message: "Vehicle created successfully" });
            }
            catch (error) {
                if (error instanceof Error)
                    return res.status(500).json({ message: error.message });
            }
        });
    }
    static deleteVehicle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const vehicle = yield ormconfig_1.dataSource
                    .getRepository(Vehicles_entity_1.Vehicle)
                    .createQueryBuilder("vehicle")
                    .where("vehicle.id = :id", { id })
                    .getOne();
                if (!vehicle)
                    return res.status(404).json({ message: "Vehicle not found" });
                yield ormconfig_1.dataSource
                    .getRepository(Vehicles_entity_1.Vehicle)
                    .createQueryBuilder()
                    .delete()
                    .from(Vehicles_entity_1.Vehicle)
                    .where("id = :id", { id })
                    .execute();
                fs_1.default.promises.unlink(path_1.default.join(__dirname, "../../" + vehicle.img_url));
                return res.status(200).json({ msg: "good" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.VehiclesController = VehiclesController;
_a = VehiclesController;
VehiclesController.getVehiclesPublic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { capacity = 1, luggage_capacity = 0, departureDate, returnDate } = req.query;
        const departure = (0, functions_1.formatDate)(departureDate);
        const returnDateObj = returnDate ? (0, functions_1.formatDate)(returnDate) : null;
        const reservedVehicles = yield ormconfig_1.dataSource
            .getRepository(Order_entity_1.Order)
            .createQueryBuilder("order")
            .innerJoin("order.vehicle", "vehicle")
            .where("order.vehicle_id = vehicle.id")
            .andWhere(new typeorm_1.Brackets((qb) => {
            qb.where("order.departureDate = :departureDate", { departureDate: departure })
                .orWhere("order.returnDate = :returnDate", { returnDate: returnDateObj || departure });
        }))
            .select("vehicle.id") // Solo necesitamos los IDs de los vehículos reservados
            .getRawMany();
        const reservedVehicleIds = reservedVehicles.map((order) => order.vehicle_id);
        // Paso 2: Obtener vehículos disponibles
        const vehicles = yield ormconfig_1.dataSource.getRepository(Vehicles_entity_1.Vehicle).find({
            where: {
                capacity: (0, typeorm_1.MoreThanOrEqual)(+capacity),
                luggage_capacity: (0, typeorm_1.MoreThanOrEqual)(+luggage_capacity),
            },
        });
        // Paso 3: Filtrar los vehículos reservados
        const availableVehicles = vehicles.filter((vehicle) => !reservedVehicleIds.includes(vehicle.id));
        return res.status(200).json(availableVehicles);
    }
    catch (err) {
        next(err);
    }
});
VehiclesController.getAllVehiclesAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skip = 1, limit = 5, status } = req.query; // Página 1 por defecto
        console.log(status);
        let whereClause = {};
        if (status !== "all") {
            whereClause.status = Number(status);
        }
        let skipValue = (parseInt(skip, 10) - 1) * parseInt(limit, 10); // Ajustamos skip
        let limitValue = parseInt(limit, 10) || 5;
        const [vehicle, total] = yield ormconfig_1.dataSource
            .getRepository(Vehicles_entity_1.Vehicle)
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
    }
    catch (error) {
        next(error);
    }
});
VehiclesController.getOneVehicle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const vehicle = ormconfig_1.dataSource
            .getRepository(Vehicles_entity_1.Vehicle)
            .createQueryBuilder("vehicle")
            .where("vehicle.id = :id", { id })
            .getOne();
        if (!vehicle)
            throw new Error("Vehicle not found");
        return res.status(200).json({ vehicle });
    }
    catch (error) {
        next(error);
    }
});
VehiclesController.updateVehicle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { brand, model, capacity, luggage_capacity, price_per_km } = req.body;
        const img = req.file;
        const posix = img === null || img === void 0 ? void 0 : img.path.replace(/\\/g, "/");
        const vehicle = yield ormconfig_1.dataSource
            .getRepository(Vehicles_entity_1.Vehicle)
            .createQueryBuilder("vehicle")
            .where("vehicle.id = :id", { id })
            .getOne();
        if (!vehicle)
            throw new Error("Vehicle not found");
        if (img) {
            fs_1.default.unlinkSync(path_1.default.join(__dirname, "../../" + vehicle.img_url));
        }
        const updateData = {
            brand,
            model,
            capacity,
            luggage_capacity,
            price_per_km,
            img_url: posix ? posix : vehicle === null || vehicle === void 0 ? void 0 : vehicle.img_url,
        };
        yield ormconfig_1.dataSource.getRepository(Vehicles_entity_1.Vehicle).save(Object.assign(Object.assign({}, vehicle), updateData));
        return res.status(200).json({ message: "Vehicle updated successfully" });
    }
    catch (error) {
        next(error);
    }
});
