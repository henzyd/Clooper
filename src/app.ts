import morgan from "morgan";
import express from "express";

import homeRouter from "./routes/home.js";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import propertyRouter from "./routes/property.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const basePath = "/api/v1";

app.use(`${basePath}/`, homeRouter);
app.use(`${basePath}/users`, userRouter);
app.use(`${basePath}/auth`, authRouter);
app.use(`${basePath}/property`, propertyRouter);

export default app;
