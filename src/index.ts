import express, { Express, json } from "express";
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
import { generateCustomOrderNum } from "./helpers/uuid";
import multer from "multer";
import { ErrorHandler } from "./middlewares/errorHandler";
import { countriesRouter } from "./routes/countries.route";
import { config } from "dotenv";
const maxSize: number = 5 * 1024 * 1024;
const app: Express = express();
const allowedOrigins = ["http://localhost:5173"];
config();
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
app.use(multer({ storage: fileStorage, limits: { fileSize: maxSize } }).single("image"));
app.use('/public', express.static(path.join(__dirname, '../public')));
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
app.use("/api/countries", countriesRouter);
app.use(ErrorHandler)

dataSource
  .initialize()
  .then(async () => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server is runnnig on port:" + process.env.PORT || 3000);
    });
  })
  .catch((err) => {
    throw new Error(err.message);
  });
