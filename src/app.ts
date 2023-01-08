import morgan from "morgan";
import express from "express";

import homeRouter from "./routes/home.js";
import userRouter from "./routes/user.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const basePath = "/api/v1";

app.use(`${basePath}`, homeRouter);
app.use(`${basePath}`, userRouter);

export default app;
