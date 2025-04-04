import { DataSource } from "typeorm";
import { config } from "dotenv";
config();
const {MYSQL_PUBLIC_URL,NODE_ENV} = process.env;
export const dataSource = new DataSource({
    type: "mysql",
    url:MYSQL_PUBLIC_URL,
    logger: 'file',
    synchronize: NODE_ENV === "dev" ? true : false,
    logging: NODE_ENV === "dev" ? false : false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations",
})