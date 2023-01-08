import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";

const propertyRouter = express.Router();

propertyRouter.route("/property").get().post();

export default propertyRouter;
