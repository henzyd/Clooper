import morgan from "morgan";
import express from "express";

import homeRouter from "./routes/homeRouter.js";
import userRouter from "./routes/usersRouter.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

const basePath = "/api/v1";

app.use(`${basePath}/`, homeRouter);
app.use(`${basePath}/users`, userRouter);

export default app;
