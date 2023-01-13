import { Request, Response, NextFunction } from "express";
import { PropertyModel, PropertyModelType } from "../db/models.js";
import { responseHandler, serverErrorResponse } from "../utils/appResponse.js";
import { sendNotificationEmail } from "../utils/mailing.js";

async function createProperty(req: Request, res: Response, next: NextFunction) {
  /**
   * This controller is responsible for creating a new property
   */

  const currentUser = res.locals.currentUser;

  //? Creating an instance of the PropertyModel
  const property = new PropertyModel<PropertyModelType>({
    owner: currentUser,
    ...req.body,
  });

  //? Saving the data and catching errors
  try {
    const newProperty = await property.save();
    if (!newProperty) {
      return responseHandler(res, 304, "Fail", "property return nothing");
    }
    // sendNotificationEmail(
    //   "henzydee@gmail.com",
    //   newProperty,
    //   newProperty.owner,
    //   newProperty._id,
    //   newProperty.owner._id
    // );
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

  console.log("this is snj s  j", res.locals.property);
  sendNotificationEmail(
    "henzydee@gmail.com",
    res.locals.property,
    res.locals.property.owner,
    res.locals.property._id,
    res.locals.property.owner._id
  );

  responseHandler(res, 200, "Success", undefined, res.locals.property);
}

async function updateProperty(req: Request, res: Response, next: NextFunction) {
  /**
   * This controller is responsible for updating a property
   */

  try {
    const property = await PropertyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (property) {
      responseHandler(res, 200, "Success", undefined, property);
    }
  } catch (err) {
    const errMsg = serverErrorResponse(err);
    res.status(500).json({ message: "Server error: " + errMsg });
  }
}

async function deleteProperty(req: Request, res: Response, next: NextFunction) {
  /**
   * This controller is responsible for deleting properties
   */

  const property = await PropertyModel.findByIdAndDelete(req.params.id);

  if (!property) {
    return responseHandler(res, 404, "Fail", "Property not found");
  }

  responseHandler(res, 204, "Success", "Property has been deleted");
}

export {
  createProperty,
  getAllProperty,
  getProperty,
  updateProperty,
  deleteProperty,
};
