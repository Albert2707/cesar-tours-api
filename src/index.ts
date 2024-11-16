import express, { Express, json } from 'express'
import { config } from "dotenv"
import { emailRouter } from './routes/email.route';
import cors from 'cors'
import { dataSource } from './ormconfig';
import "reflect-metadata";
config();
const app: Express = express();
const allowedOrigins = ['http://localhost:5173'];

const options: cors.CorsOptions = {
    origin: allowedOrigins
};
app.use(cors(options))
app.use(json())
app.use("/api/email", emailRouter)
dataSource.initialize().then(async () => {
    app.listen(process.env.PORT || 3000, () => {
        console.log("Server is runnnig on port:" + process.env.PORT || 3000)
    })
    console.log("Data Source has been initialized!");
}).catch(err => {
    console.log(err.message)
    throw new Error(err.message)
})
