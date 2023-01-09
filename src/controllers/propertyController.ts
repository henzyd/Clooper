import { Request, Response, NextFunction } from "express";
import {
  PropertyModel,
  PropertyModelType,
  UserModel,
  UserModelType,
} from "../db/models.js";
import { responseHandler, serverErrorResponse } from "../utils/appResponse.js";
import { getCurrentUser } from "../utils/currentUser.js";

async function createProperty(req: Request, res: Response, next: NextFunction) {
  /**
   * This controller is responsible for creating a new property
   */

  const currentUser = await UserModel.findById("63bb37f5745072a3de6064cb");
  // console.log(currentUser);

  //? Creating an instance of the PropertyModel
  const property = new PropertyModel<PropertyModelType>({
    owner: currentUser,
    ...req.body,
  });

  //? Saving the data and catching errors
  try {
    const newProperty = await property.save();
    responseHandler(
      res,
      201,
      "Success",
      `${newProperty.name} has been created`,
      newProperty
    );
  } catch (err) {
    const errMsg = serverErrorResponse(err);
    res.status(500).json({ message: "Server error: " + errMsg });
  }
}

async function getAllProperty(req: Request, res: Response, next: NextFunction) {
  /**
   * This controller is responsible for getting all the properties
   */

  try {
    const propertyList = await PropertyModel.find({}).populate("owner");
    responseHandler(res, 200, "Success", undefined, propertyList);
  } catch (err) {
    const errMsg = serverErrorResponse(err);
    res.status(500).json({ message: "Server error: " + errMsg });
  }
}

async function getProperty(req: Request, res: Response, next: NextFunction) {
  /**
   * This controller is responsible for getting a property
   */
  console.log("this is snj s  j", req.body);

  responseHandler(res, 200, "Success", undefined, req.body._DBproperty);
}

async function updateProperty(req: Request, res: Response, next: NextFunction) {
  /**
   * This controller is responsible for updating a property
   */

  const token = req.headers.authorization;

  if (token) {
    const currentUser: any = await getCurrentUser(token.split(" ")[1], res);
    const property = await PropertyModel.findById(req.params.id);

    if (currentUser && property) {
      if (property.owner === currentUser._id) {
        console.log("Related");
      } else {
        console.log("Not Related");
      }
    } else {
      return responseHandler(res, 404, "Fail", "Property not found");
    }
    console.log("this the current user :>>> ", currentUser);
    console.log("this the property :>>> ", property);
  }

  try {
    const property = await PropertyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (property) {
      return responseHandler(res, 200, "Success", undefined, property);
    }
  } catch (err) {
    // console.log(err);
  }
}

export { createProperty, getAllProperty, getProperty, updateProperty };
