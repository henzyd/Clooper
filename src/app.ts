import morgan from "morgan";
import express from "express";

import homeRouter from "./routes/home.js";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const basePath = "/api/v1";

app.use(`${basePath}`, homeRouter);
app.use(`${basePath}`, userRouter);
app.use(`${basePath}`, authRouter);

export default app;
