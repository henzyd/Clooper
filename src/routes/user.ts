import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", protectRoute, getAllUsers);

export default userRouter;
