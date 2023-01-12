import morgan from "morgan";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { options } from "./docs/swaggerOptions.js";

import homeRouter from "./routes/home.js";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import propertyRouter from "./routes/property.js";
import adminControl from "./routes/admin.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const basePath = "/api/v1";

const op2 = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Swagger Property Manager - OpenAPI 3.0.3",
      description:
        "This is a property manager built with Express.js, TypeScript and Mongoose",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3020",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
// const swaggerSpec = swaggerJSDoc(op2);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`${basePath}/`, homeRouter);
app.use(`${basePath}/users`, userRouter);
app.use(`${basePath}/auth`, authRouter);
app.use(`${basePath}/property`, propertyRouter);
app.use(`${basePath}/${process.env.ADMIN_HASH_ROUTE}`, adminControl);

export default app;
