import { Request, Response, NextFunction } from "express";
import { PropertyModel, PropertyModelType, UserModel } from "../db/models.js";
import { responseHandler, serverErrorResponse } from "../utils/appResponse.js";

async function publishProperty(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /**
   * This controller is responsible for publishing or unpublishing the properties
   * NOTE: this controller is only accessible by an admin
   */

  const { is_published } = req.body;
  const bodyKeys = Object.keys(req.body);

  if (!bodyKeys.includes("is_published")) {
    return responseHandler(res, 304, undefined, "Property is not modified");
  }
  if (!(typeof is_published === "boolean")) {
    return responseHandler(res, 304, undefined, "Property is not modified");
  }

  const propertyID = req.params.id;
  req.body.is_published = is_published;

  try {
    const property = await PropertyModel.findByIdAndUpdate(
      propertyID,
      req.body,
      { new: true }
    );
    if (property) {
      responseHandler(
        res,
        200,
        "Success",
        "Property has been published",
        property
      );
    } else {
      return responseHandler(res, 404, "Fail", "Property does not exist");
    }
  } catch (err) {
    const errMsg = serverErrorResponse(err);
    res.status(500).json({ message: "Server error: " + errMsg });
  }
}

async function activateUser(req: Request, res: Response, next: NextFunction) {
  /**
   * This controller is responsible for activating or deactivating a user
   * NOTE: This controller is only accessible by an admin
   */

  const userID = req.params.id;
  const { is_active } = req.body;
  const bodyKeys = Object.keys(req.body);
  const userBeingUpdated = await UserModel.findById(userID).select("+is_admin");

  if (!userBeingUpdated) {
    return responseHandler(res, 400, "Fail", "User not found");
  }

  if (userBeingUpdated.is_admin) {
    return responseHandler(
      res,
      404,
      "Fail",
      "Admin users can not be deactivated by another admin"
    );
  }

  if (!bodyKeys.includes("is_active")) {
    return responseHandler(res, 400, "Fail", "User is not modified.");
  }
  if (!(typeof is_active === "boolean")) {
    return responseHandler(res, 422, "Fail", "is_active in invalid");
  }

  req.body.is_active = is_active;

  try {
    const property = await UserModel.findByIdAndUpdate(userID, req.body, {
      new: true,
    }).select(["+is_active", "+is_admin"]);
    if (property) {
      responseHandler(
        res,
        200,
        "Success",
        "Property has been published",
        property
      );
    } else {
      return responseHandler(res, 404, "Fail", "Property does not exist");
    }
  } catch (err) {
    const errMsg = serverErrorResponse(err);
    res.status(500).json({ message: "Server error: " + errMsg });
  }

  next();
}

export { publishProperty, activateUser };
