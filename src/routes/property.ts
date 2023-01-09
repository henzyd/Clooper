import express from "express";
import {
  createProperty,
  getAllProperty,
  getProperty,
  updateProperty,
} from "../controllers/propertyController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  checkParamID,
  createPropertyMiddleware,
} from "../middleware/propertyMiddleware.js";

const propertyRouter = express.Router();

propertyRouter
  .route("/")
  .get(protectRoute, getAllProperty)
  .post(protectRoute, createProperty);

propertyRouter
  .route("/:id")
  .get([protectRoute, checkParamID], getProperty)
  .patch(protectRoute, updateProperty);

export default propertyRouter;
