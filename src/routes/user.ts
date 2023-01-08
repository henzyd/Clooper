import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { createUser, logInUser } from "../controllers/authController.js";

const userRouter = express.Router();

userRouter.get("/users", getAllUsers);
userRouter.post("/signup", createUser);
userRouter.post("/login", logInUser);

export default userRouter;
