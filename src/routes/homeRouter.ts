import express from "express";
import { welcomeMessage } from "../controllers/homeController.js";

const homeRouter = express.Router();

homeRouter.get("/", welcomeMessage);

export default homeRouter;
