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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const ormconfig_1 = require("../config/ormconfig");
const Order_entity_1 = require("../entity/Order.entity");
const uuid_1 = require("../helpers/uuid");
const Customer_entity_1 = require("../entity/Customer.entity");
const Vehicles_entity_1 = require("../entity/Vehicles.entity");
const vehicleEnums_1 = require("../enums/vehicleEnums");
const functions_1 = require("../utils/functions");
const Locations_1 = require("../entity/Locations");
class OrderController {
}
exports.OrderController = OrderController;
_a = OrderController;
OrderController.getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skip = 1, limit = 5, status, reservation_num } = req.query;
        let whereClause = {};
        if (status && status !== "all") {
            whereClause.status = Number(status);
        }
        if (reservation_num) {
            whereClause.order_num = reservation_num;
        }
        let skipValue = (parseInt(skip, 10) - 1) * parseInt(limit, 10); // Ajustamos skip
        let limitValue = parseInt(limit, 10) || 5;
        const [order, total] = yield ormconfig_1.dataSource
            .getRepository(Order_entity_1.Order)
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
    }
    catch (error) {
        next(error);
    }
});
OrderController.getOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: orderNum } = req.params;
        const order = yield ormconfig_1.dataSource
            .getRepository(Order_entity_1.Order)
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
    }
    catch (error) {
        next(error);
    }
});
OrderController.createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = ormconfig_1.dataSource.getRepository(Order_entity_1.Order);
        const customer = ormconfig_1.dataSource.getRepository(Customer_entity_1.Customer);
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
        const location = ormconfig_1.dataSource.getRepository(Locations_1.Location);
        const customerCreated = yield customer.save(newCustomer);
        const newOriginLocation = location.create({
            formatted_address: formatted_origin_address,
            lat: origin_lat,
            lng: origin_lng,
        });
        const newDestinationLocation = location.create({
            formatted_address: formatted_destination_address,
            lat: destination_lat,
            lng: destination_lng,
        });
        const originLocationCreated = yield location.save(newOriginLocation);
        const destinationLocationCreated = yield location.save(newDestinationLocation);
        const { location_id: originId } = originLocationCreated;
        const { location_id: destinationId } = destinationLocationCreated;
        const { customer_id: customerId } = customerCreated;
        const body = req.body;
        const { departureDate, returnDate } = body;
        const departure = (0, functions_1.formatToDatabaseDate)(departureDate);
        const returnDateObj = returnDate
            ? (0, functions_1.formatToDatabaseDate)(returnDate)
            : undefined;
        const orderToCreate = Object.assign(Object.assign({}, body), { departureDate: departure, returnDate: returnDateObj, order_num: (0, uuid_1.generateCustomOrderNum)(), customerId,
            originId,
            destinationId });
        const findOrder = yield order.findOne({
            where: { order_num: orderToCreate.order_num },
            relations: ["vehicle"],
        });
        if (findOrder)
            return res.status(400).json({ message: "Order already exists" });
        const newOrder = order.create(orderToCreate);
        const orderCreated = yield order.save(newOrder);
        const getOrder = yield ormconfig_1.dataSource
            .getRepository(Order_entity_1.Order)
            .createQueryBuilder("order")
            .innerJoinAndSelect("order.customer", "customer")
            .innerJoinAndSelect("order.vehicle", "vehicle")
            .innerJoinAndSelect("order.origin", "origin")
            .innerJoinAndSelect("order.destination", "destination")
            .where("order.order_num = :orderNum", { orderNum: orderCreated.order_num })
            .getOne();
        yield ormconfig_1.dataSource
            .getRepository(Vehicles_entity_1.Vehicle)
            .createQueryBuilder("vehicles")
            .update(Vehicles_entity_1.Vehicle, { status: vehicleEnums_1.VehicleState.UNAVAILABLE })
            .where("vehicles.id = :id", { id: orderCreated.vehicleId })
            .updateEntity(true)
            .execute();
        return res
            .status(201)
            .json({ message: "Order created successfully", orderCreated: getOrder });
    }
    catch (error) {
        if (error instanceof Error)
            next(error);
    }
});
OrderController.updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: orderNum } = req.params;
        const { status } = req.body;
        const order = yield ormconfig_1.dataSource
            .getRepository(Order_entity_1.Order)
            .createQueryBuilder("order")
            .where("order.order_num = :orderNum", { orderNum })
            .getOne();
        const data = {
            status,
        };
        if (!order)
            throw new Error("Order not found");
        yield ormconfig_1.dataSource.getRepository(Order_entity_1.Order).save(Object.assign(Object.assign({}, order), data));
        return res.status(200).json({ message: "Order updated successfully" });
    }
    catch (error) {
        next(error);
    }
});
OrderController.deleteOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderNum } = req.params;
        yield ormconfig_1.dataSource.getRepository(Order_entity_1.Order)
            .createQueryBuilder()
            .delete()
            .from(Order_entity_1.Order)
            .where("order_num = :order_num", { order_num: orderNum })
            .execute();
        return res.status(200).json({ message: "Order deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
