import { DataSource } from "typeorm";
import { config } from "dotenv";
config();
const {NODE_ENV,MYSQL_USER,MYSQL_PASSWORD,MYSQL_HOST,MYSQL_PORT,MYSQL_DATABASE} = process.env;
export const dataSource = new DataSource({
    type: "mysql",
    host:MYSQL_HOST,
    username:MYSQL_USER,
    password:MYSQL_PASSWORD,
    port: +MYSQL_PORT!,
    database:MYSQL_DATABASE,
    logger: 'file',
    synchronize: NODE_ENV === "dev"? true : false,
    logging: NODE_ENV === "dev"|| NODE_ENV === 'test' ? false : false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations",
})