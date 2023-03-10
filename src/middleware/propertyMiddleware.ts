import { Request, Response, NextFunction } from "express";
import { PropertyModelType, PropertyModel, UserModel } from "../db/models.js";
import { responseHandler, serverErrorResponse } from "../utils/appResponse.js";
import { getCurrentUser } from "../utils/currentUser.js";

async function createPropertyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /**
   * This is middleware function used to handle request body data
   */

  const {
    name,
    address,
    type,
    description,
    image_url,
    total_rooms,
    occupancy_type,
    rent_amount,
    rent_frequency,
  }: PropertyModelType = req.body;

  //? Check if all required keys in req.body is present
  if (!name) {
    return responseHandler(res, 404, "Fail", "Name is required");
  }
  if (!address) {
    return responseHandler(res, 404, "Fail", "Address is required");
  }
  if (!type) {
    return responseHandler(res, 404, "Fail", "Type is required");
  }
  if (!description) {
    return responseHandler(res, 404, "Fail", "Description is required");
  }
  if (!image_url) {
    return responseHandler(res, 404, "Fail", "Image URL is required");
  }
  if (!total_rooms) {
    return responseHandler(res, 404, "Fail", "Total Rooms is required");
  }
  if (!rent_amount) {
    return responseHandler(res, 404, "Fail", "Rent Amount is required");
  }
  if (!rent_frequency) {
    return responseHandler(res, 404, "Fail", "Rent Frequency is required");
  }

  next();
}

async function checkUser(req: Request, res: Response, next: NextFunction) {
  /**
   * This is middleware function used to check if slug is valid
   */
  const userToken = req.headers.authorization;
  if (!userToken) {
    return responseHandler(
      res,
      401,
      "fail",
      "You must be logged in to access this"
    );
  }
  try {
    const token = userToken.split(" ")[1];
    // console.log(token);
    const user = getCurrentUser(token, res);
    if (!user) {
      return responseHandler(res, 404, "fail", "User not found");
    }
  } catch (err) {
    console.log("safe\n", err);
  }
  next();
}

async function checkParamID(req: Request, res: Response, next: NextFunction) {
  /**
   * This is middleware function used to check if req.params.id is valid if it is valid it will assign a new key to the request object and value will be the data gotten from the DB using that ID.
   */

  try {
    const property = await PropertyModel.findById(req.params.id).populate(
      "owner"
    );
    if (property) {
      res.locals.property = property;
    } else {
      return responseHandler(res, 404, "Fail", "Property does not exist");
    }
  } catch (err) {
    const errMsg = serverErrorResponse(err);
    res.status(500).json({ message: "Server error: " + errMsg });
  }
  next();
}

async function modifyProperty(req: Request, res: Response, next: NextFunction) {
  /**
   * This middleware is responsible for modifying the properties in the DB
   */

  const token = req.headers.authorization;

  if (token) {
    const currentUser = res.locals.currentUser;
    const property = res.locals.property;
    const admin = currentUser.is_admin;

    if (currentUser && property) {
      if (!property.owner._id.equals(currentUser._id) && !admin) {
        return responseHandler(
          res,
          403,
          "Fail",
          "You are not allowed to access this"
          //
        );
      }
    } else {
      return responseHandler(
        res,
        403,
        "Fail",
        "You are not allowed to access this"
      );
    }
  }

  next();
}

export { createPropertyMiddleware, checkParamID, modifyProperty };
