import express, { Express, json, NextFunction, Request, Response } from "express";
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
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { SimpleConsoleLogger } from "typeorm";
import { generateCustomOrderNum } from "./helpers/uuid";
import multer, { MulterError } from "multer";
import { ErrorHandler } from "./middlewares/errorHandler";
config();
const maxSize: number = 5 * 1024 * 1024;
const app: Express = express();
const allowedOrigins = ["http://localhost:5173"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/assets/images");
  },
  filename: (req, file, cb) => {
    cb(null, generateCustomOrderNum() + "-" + file.originalname);
  },
});
app.use(multer({ storage: fileStorage, limits:{fileSize:maxSize}}).single("image"));
app.use('/public',express.static(path.join(__dirname, '../public')));
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
app.use(ErrorHandler)

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
