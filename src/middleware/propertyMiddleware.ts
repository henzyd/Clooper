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
  //   {
  //     "name": "uche",
  //     "address": "address",
  //     "type": "type",
  //     "description": "description",
  //     "image_url": ["image_url", "image_url", "image_url"],
  //     "total_rooms": 3,
  //     "occupancy_type": "occupancy_type",
  //     "rent_amount": 3,
  //     "rent_frequency": "rent_frequency",
  //     "is_published": true
  // }

  //? Check if all required keys in req.body is present
  if (!name) {
    return responseHandler(res, 404, "fail", "Name is required");
  }
  if (!address) {
    return responseHandler(res, 404, "fail", "Address is required");
  }
  if (!type) {
    return responseHandler(res, 404, "fail", "Type is required");
  }
  if (!description) {
    return responseHandler(res, 404, "fail", "Description is required");
  }
  if (!image_url) {
    return responseHandler(res, 404, "fail", "Image URL is required");
  }
  if (!total_rooms) {
    return responseHandler(res, 404, "fail", "Total Rooms is required");
  }
  if (!occupancy_type) {
    return responseHandler(res, 404, "fail", "Occupancy Type is required");
  }
  if (!rent_amount) {
    return responseHandler(res, 404, "fail", "Rent Amount is required");
  }
  if (!rent_frequency) {
    return responseHandler(res, 404, "fail", "Rent Frequency is required");
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
    const DBproperty = await PropertyModel.findById(req.params.id).populate(
      "owner"
    );
    if (DBproperty) {
      req.body._DBproperty = DBproperty;
      return responseHandler(res, 200, "Success", undefined, DBproperty);
    }
  } catch (err) {
    return responseHandler(res, 404, "fail", "Property not found");
  }
  next();
}

export { createPropertyMiddleware, checkParamID };
