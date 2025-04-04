"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { MYSQL_PUBLIC_URL, NODE_ENV } = process.env;
exports.dataSource = new typeorm_1.DataSource({
    type: "mysql",
    url: MYSQL_PUBLIC_URL,
    logger: 'file',
    synchronize: NODE_ENV === "dev" ? true : false,
    logging: NODE_ENV === "dev" ? false : false,
    entities: ["src/entity/**/*.js"],
    migrations: ["src/migrations/*.js"],
    migrationsTableName: "migrations",
});
