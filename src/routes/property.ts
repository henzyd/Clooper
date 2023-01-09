import express from "express";
import {
  createProperty,
  getAllProperty,
  getProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  checkParamID,
  createPropertyMiddleware,
  modifyProperty,
} from "../middleware/propertyMiddleware.js";

const propertyRouter = express.Router();

propertyRouter
  .route("/")
  .get(protectRoute, getAllProperty)
  .post(protectRoute, createProperty);

propertyRouter
  .route("/:id")
  .get([protectRoute, checkParamID], getProperty)
  .patch([protectRoute, checkParamID, modifyProperty], updateProperty)
  .delete([protectRoute, checkParamID, modifyProperty], deleteProperty);

export default propertyRouter;
