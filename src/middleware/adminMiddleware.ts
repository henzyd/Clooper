import { Request, Response, NextFunction } from "express";
import { PropertyModelType, PropertyModel, UserModel } from "../db/models.js";
import { responseHandler, serverErrorResponse } from "../utils/appResponse.js";
import { getCurrentUser } from "../utils/currentUser.js";

async function checkAdmin(req: Request, res: Response, next: NextFunction) {
  /**
   * This middleware is responsible for checking if the current user accessing the endpoint is an admin
   */
  const currentUser = res.locals.currentUser;

  if (currentUser.is_admin === false) {
    return responseHandler(res, 403, "Fail", "You are not allowed");
  }

  next();
}

export { checkAdmin };
