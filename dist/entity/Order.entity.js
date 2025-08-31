"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const Country_entity_1 = require("./Country.entity");
const Vehicles_entity_1 = require("./Vehicles.entity");
const Customer_entity_1 = require("./Customer.entity");
const Locations_1 = require("./Locations");
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Order.prototype, "order_num", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Locations_1.Location),
    (0, typeorm_1.JoinColumn)({ name: "origin_id" }),
    __metadata("design:type", Locations_1.Location)
], Order.prototype, "origin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "origin_id" }),
    __metadata("design:type", String)
], Order.prototype, "originId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Locations_1.Location),
    (0, typeorm_1.JoinColumn)({ name: "destination_id" }),
    __metadata("design:type", Locations_1.Location)
], Order.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "destination_id" }),
    __metadata("design:type", String)
], Order.prototype, "destinationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["one_way", "round_trip"], default: "one_way" }),
    __metadata("design:type", String)
], Order.prototype, "trip_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "passengers", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "luggage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "departure_date", type: 'date' }),
    __metadata("design:type", String)
], Order.prototype, "departureDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "departure_hour" }),
    __metadata("design:type", String)
], Order.prototype, "departureHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "return_date", nullable: true, type: 'date' }),
    __metadata("design:type", String)
], Order.prototype, "returnDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "return_hour", nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "returnHours", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Country_entity_1.Country),
    (0, typeorm_1.JoinColumn)({ name: "country_id" }),
    __metadata("design:type", Country_entity_1.Country)
], Order.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "country_id" }),
    __metadata("design:type", String)
], Order.prototype, "countryId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "distance", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Vehicles_entity_1.Vehicle),
    (0, typeorm_1.JoinColumn)({ name: "vehicle_id" }),
    __metadata("design:type", Vehicles_entity_1.Vehicle)
], Order.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "vehicle_id" }),
    __metadata("design:type", String)
], Order.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: "customer_id" }),
    __metadata("design:type", Customer_entity_1.Customer)
], Order.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "customer_id" }),
    __metadata("design:type", String)
], Order.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "airline", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "flight_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "additional_notes", nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "additionalNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "payment_method", type: "enum", enum: ["Cash", "Card"], default: "Cash" }),
    __metadata("design:type", String)
], Order.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Order.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Order.prototype, "updateAt", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)({ name: "orders", schema: "cesar_tours" })
], Order);
