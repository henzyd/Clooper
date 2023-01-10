import express from "express";
import {
  createAdmin,
  createUser,
  logInUser,
  logInAdmin,
} from "../controllers/authController.js";
import {
  createUserMiddleware,
  loginMiddleware,
} from "../middleware/authMiddleware.js";

const authRouter = express.Router();

const adminEncryptedRoute = "";

authRouter.post(`/signup`, createUserMiddleware, createUser);
authRouter.post(`/login`, loginMiddleware, logInUser);
authRouter.post(
  `${adminEncryptedRoute}/admin-signup`,
  createUserMiddleware,
  createAdmin
);
authRouter.post(
  `${adminEncryptedRoute}/admin-login`,
  loginMiddleware,
  logInAdmin
);

export default authRouter;
