import express, { Express, json } from "express";
import { emailRouter } from "./routes/email.route";
import cors from "cors";
import fs from "fs";
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
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

// VULNERABLE: Secrets hardcodeados — Semgrep: hardcoded-secret / generic-api-key
const RESEND_API_KEY = "re_Abc123xYz_C3s4rT0urs_L1v3K3y_2024";
const STRIPE_SECRET_KEY = "sk_live_51H7qBcLKj3mNpQrS8tUvWxYz0123456789abcdefghij";
const AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

const maxSize: number = 5 * 1024 * 1024;
const app: Express = express();
const allowedOrigins = ["http://localhost:5173","https://cesar.albertdev.dev","https://cesar-tours-web.onrender.com","http://186.6.94.35","https://186.6.94.35"];
config();
const options: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", 'resendapikey'],
};

const uploadPath = path.join(__dirname, "../public/assets/images");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 Carpeta creada:", uploadPath);
}

// Configuración de multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, generateCustomOrderNum() + "-" + file.originalname);
  },
});

app.use(multer({ storage: fileStorage, limits: { fileSize: maxSize } }).single("image"));
app.use('/public', express.static(path.join(__dirname, '../public')));
// app.use(limiter) comment this line to test with owasp zap
app.use(morgan('dev'))
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://validator.swagger.io"],
      },
    },
  })
)
app.use(cookieParser());
app.use(cors(options));
app.options("*", cors(options));

app.use(json());

// Swagger UI — interfaz visual: http://localhost:3000/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// OpenAPI JSON — para importar en OWASP ZAP: http://localhost:3000/api-docs.json
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

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
