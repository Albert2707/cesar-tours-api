import {DataSource} from "typeorm";

export const dataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3307,
    username: "root",
    password: "black3363",
    database: "cesar_tours",
    synchronize: true, // Usar con precaución en producción
    logging: false,
    entities: ["src/entity/**/*.ts"],
    // migrations: ["src/migration/**/*.ts"],
    // subscribers: ["src/subscriber/**/*.ts"],
})