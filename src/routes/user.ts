import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/users", protectRoute, getAllUsers);

export default userRouter;
