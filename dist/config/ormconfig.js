"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { NODE_ENV, MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE } = process.env;
console.log(MYSQL_USER),
exports.dataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: MYSQL_HOST,
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    port: +MYSQL_PORT,
    database: MYSQL_DATABASE,
    logger: 'file',
    synchronize: NODE_ENV === "dev" ? true : false,
    logging: NODE_ENV === "dev" || NODE_ENV === 'test' ? false : false,
    entities: ["src/entity/**/*.js"],
    migrations: ["src/migrations/*.js"],
    migrationsTableName: "migrations",
});
