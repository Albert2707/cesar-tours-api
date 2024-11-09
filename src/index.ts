import express, { Express, json } from 'express'
import { config } from "dotenv"
import { emailRouter } from './routes/email.route';
import cors from 'cors'
config();
const app: Express = express();
const allowedOrigins = ['http://localhost:5173'];

const options: cors.CorsOptions = {
    origin: allowedOrigins
};
app.use(cors(options))
app.use(json())
app.use("/api/email", emailRouter)
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is runnnig on port:" + process.env.PORT || 3000)
})