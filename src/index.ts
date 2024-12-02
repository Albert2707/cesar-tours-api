import express, { Express, json } from "express";
import { config } from "dotenv";
import { emailRouter } from "./routes/email.route";
import cors from "cors";
import { dataSource } from "./config/ormconfig";
import "reflect-metadata";
import cookieParser from "cookie-parser";
import { vehicleRouter } from "./routes/vehicle.route";
import { userRouter } from "./routes/user.route";
import { orderRouter } from "./routes/order.route";
import helmet from "helmet";
import morgan from "morgan"
import { limiter } from "./middlewares/limiter";
config();
const app: Express = express();
const allowedOrigins = ["http://localhost:5173"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};


app.use(limiter)
app.use(morgan('dev'))
app.use(helmet())
app.use(cookieParser());
app.use(cors(options));

app.use(json());
app.use("/api/email", emailRouter);
app.use("/api/vehicle", vehicleRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
dataSource
  .initialize()
  .then(async () => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server is runnnig on port:" + process.env.PORT || 3000);
    });
  })
  .catch((err) => {
    console.log(err.message);
    throw new Error(err.message);
  });
