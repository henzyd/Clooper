import express from "express";
import { createUser, logInUser } from "../controllers/authController.js";
import {
  createUserMiddleware,
  loginMiddleware,
} from "../middleware/authMiddleware.js";

const authRouter = express.Router();

const mainRoute = "/auth";

authRouter.post(`${mainRoute}/signup`, createUserMiddleware, createUser);
authRouter.post(`${mainRoute}/login`, loginMiddleware, logInUser);

export default authRouter;
