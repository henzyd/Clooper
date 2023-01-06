import express from "express";
import { createUser, getAllUsers } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/").get(getAllUsers).post(createUser);

export default userRouter;
