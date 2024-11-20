import {DataSource} from "typeorm";
import {config} from "dotenv";
config();
export const dataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3307,
    username: "root",
    password: "black3363",
    database: "cesar_tours",
    synchronize: process.env.NODE_ENV === "dev" ? false : false,
    logging: process.env.NODE_ENV === "dev" ? false : false,
    entities: ["src/entity/**/*.ts"],
    // migrations: ["../../migrations/**/*.ts"],
    // subscribers: ["src/subscriber/**/*.ts"],
})