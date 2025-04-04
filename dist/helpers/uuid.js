"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCustomOrderNum = void 0;
const uuid_1 = require("uuid");
const generateCustomOrderNum = () => {
    const seed = Date.now();
    const customOrderNum = `${seed}${(0, uuid_1.v4)().replace(/-/g, "")}`.substring(0, 12);
    return customOrderNum;
};
exports.generateCustomOrderNum = generateCustomOrderNum;
