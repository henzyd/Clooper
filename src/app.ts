import fs from "fs";
import morgan from "morgan";
import express from "express";
import swaggerUi from "swagger-ui-express";
// import swaggerJSDoc from "swagger-jsdoc";
import swaggerAutogen from "swagger-autogen";

import homeRouter from "./routes/home.js";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import propertyRouter from "./routes/property.js";
import adminControl from "./routes/admin.js";
import swagger_output from "./docs/swagger_output.json";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const basePath = "/api/v1";

// const data = JSON.parse(
//   fs.readFileSync(`${__dirname}/docs/swagger_output.json`, "utf8")
// );

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swagger_output));
app.use(`${basePath}/`, homeRouter);
app.use(`${basePath}/users`, userRouter);
app.use(`${basePath}/auth`, authRouter);
app.use(`${basePath}/property`, propertyRouter);
app.use(`${basePath}/${process.env.ADMIN_HASH_ROUTE}`, adminControl);

export default app;
