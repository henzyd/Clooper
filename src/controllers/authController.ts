import { Request, Response, NextFunction } from "express";
import { UserModel, UserModelType } from "../db/models.js";
import { responseHandler, serverErrorResponse } from "../utils/appResponse.js";
import { signinJWT } from "../utils/token.js";
import { createUserOrAdmin, loginUserOrAdmin } from "../utils/auth.js";

async function createUser(req: Request, res: Response, next: NextFunction) {
  /**
     This is a controller that handles the creation of a new user
  
     Resquest Body Parameters: 
       first_name: String,
       last_name: String,
       phone: String, // NOTE: this must include country code
       email: String,
       password: String,
  
     Responses:
       201: Success
       500: Server error
   */

  //? Here I am using the function createUserOrAdmin() to create a new user
  const userData = await createUserOrAdmin(req);

  if (userData.status === "Fail") {
    return responseHandler(res, 409, userData.status, userData.message);
  }

  const { user, token } = { ...userData };

  //? Saving the user in the DB and returning a response to the user
  try {
    if (!user) {
      return responseHandler(res, 422, "Fail", "Data cannot be saved");
    }
    const newUser = await user.save();
    res.status(201).json({
      status: "Success",
      message: `${newUser.first_name} ${newUser.last_name} has been created`,
      token: token,
      data: newUser,
    });
  } catch (err) {
    const errMsg = serverErrorResponse(err);
    res.status(500).json({ message: "Server error \n", errMsg });
  }
}

async function logInUser(req: Request, res: Response, next: NextFunction) {
  /**
     This is a controller that handles the creation of a new user
  
     Resquest Body Parameters:
       email: String,
       password: String,
  
     Responses:
       200: Success
       500: Server error
   */

  //? Here I am creating using the loginUserOrAdmin function to login a user
  const userData: any = await loginUserOrAdmin(req);

  if (userData.status === "Fail") {
    return responseHandler(res, 401, userData.status, userData.message);
  }

  try {
    const token = signinJWT(userData);
    res.status(200).json({
      status: "Success",
      message: `${userData.first_name} ${userData.last_name} has been logged in successfully`,
      token,
    });
  } catch (err) {
    const errMsg = serverErrorResponse(err);
    res.status(500).json({ message: "Server error \n", errMsg });
  }
}

async function createAdmin(req: Request, res: Response, next: NextFunction) {
  /**
     This is a controller that handles the creation of a new admin user
  
     Resquest Body Parameters: 
       first_name: String,
       last_name: String,
       phone: String, // NOTE: this must include country code
       email: String,
       password: String,
  
     Responses:
       201: Success
       500: Server error
   */
  //? Here I am using the function createUserOrAdmin() to create a new admin
  const adminData = await createUserOrAdmin(req, true);

  if (adminData.status === "Fail") {
    return responseHandler(res, 409, adminData.status, adminData.message);
  }

  const { user, token } = { ...adminData };

  try {
    if (!user) {
      return responseHandler(
        res,
        422,
        "Fail",
        "Data cannot be saved, please try again"
      );
    }
    const newUser = await user.save();
    res.status(201).json({
      status: "Success",
      message: `Admin has been created`,
      token: token,
      data: newUser,
    });
  } catch (err) {
    const errMsg = serverErrorResponse(err);
    res.status(500).json({ message: "Server error \n", errMsg });
  }
}

async function logInAdmin(req: Request, res: Response, next: NextFunction) {
  /**
     This is a utility that handles the creation of a new user
  
     Resquest Body Parameters:
       email: String,
       password: String,
   */

  //? Here I am creating using the loginUserOrAdmin function to login a admin
  const adminData: any = await loginUserOrAdmin(req);

  if (adminData.status === "Fail") {
    return responseHandler(res, 401, adminData.status, adminData.message);
  }

  try {
    const token = signinJWT(adminData);
    res.status(200).json({
      status: "Success",
      message: `You have been loggin successfully`,
      token,
    });
  } catch (err) {
    const errMsg = serverErrorResponse(err);
    res.status(500).json({ message: "Server error \n", errMsg });
  }
}

export { createUser, logInUser, createAdmin, logInAdmin };
