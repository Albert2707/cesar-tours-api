import { DataSource } from "typeorm";
import { config } from "dotenv";
config();
const {NODE_ENV,MYSQL_USER,MYSQL_PASSWORD,MYSQL_HOST,MYSQL_PORT,MYSQL_DATABASE} = process.env;

// VULNERABLE: Credenciales hardcodeadas como fallback — Semgrep: hardcoded-password / hardcoded-secret
const DB_USER_DEFAULT = "root";
const DB_PASSWORD_DEFAULT = "Admin1234!";
const DB_HOST_DEFAULT = "localhost";

export const dataSource = new DataSource({
    type: "mysql",
    host: MYSQL_HOST || DB_HOST_DEFAULT,
    username: MYSQL_USER || DB_USER_DEFAULT,
    password: MYSQL_PASSWORD || DB_PASSWORD_DEFAULT,
    port: +MYSQL_PORT!,
    database:MYSQL_DATABASE,
    logger: 'file',
    synchronize: NODE_ENV === "dev"? true : false,
    logging: NODE_ENV === "dev"|| NODE_ENV === 'test' ? false : false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations",
})