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
    console.log(currentUser._id);

    if (!newProperty) {
      return responseHandler(res, 304, "Fail", "property return nothing");
    }
    setTimeout(
      () =>
        sendNotificationEmail(
          "henzydee@gmail.com",
          property,
          property.owner,
          property._id,
          currentUser._id
        ),
      1200000
      // 12000
    );
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
  // sendNotificationEmail(
  //   "henzydee@gmail.com",
  //   res.locals.property,
  //   res.locals.property.owner,
  //   res.locals.property._id,
  //   res.locals.property.owner._id
  // );

  responseHandler(res, 200, "Success", undefined, res.locals.property);
}

async function updateProperty(req: Request, res: Response, next: NextFunction) {
  /**
   * This controller is responsible for updating a property
   */

  //? Here I am updating the date for the update_at every time a user updates a property
  const body = req.body;
  body.updated_at = Date.now() - 1000;

  try {
    const property = await PropertyModel.findByIdAndUpdate(
      req.params.id,
      body,
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
