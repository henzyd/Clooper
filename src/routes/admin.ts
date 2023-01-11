import express from "express";
import {
  activateUser,
  publishProperty,
} from "../controllers/adminController.js";
import { getAllProperty } from "../controllers/propertyController.js";
import { checkAdmin } from "../middleware/adminMiddleware.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { checkParamID } from "../middleware/propertyMiddleware.js";

const adminControl = express.Router();

adminControl.route("/property").get([protectRoute, checkAdmin], getAllProperty);
adminControl
  .route("/publish-property/:id")
  .post([protectRoute, checkParamID, checkAdmin], publishProperty);
adminControl
  .route("/user-active/:id")
  .post([protectRoute, checkAdmin], activateUser);

export default adminControl;
