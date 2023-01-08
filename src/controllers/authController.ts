import { Request, Response, NextFunction } from "express";
import { UserModel, UserModelType } from "../db/models.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { phone as phoneCheck } from "phone";
import jwt, { SignOptions } from "jsonwebtoken";

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

  const reqBody: UserModelType = { ...req.body };

  //? Checking if the email and phone are valid
  const email = validator.default.isEmail(reqBody.email);
  const phoneObj = phoneCheck(reqBody.phone);
  const phone = phoneObj.isValid;
  if (!email || !phone) {
    return res.status(422).json({
      status: "fail",
      message: "Invalid email or phone",
    });
  }

  //? Checking if the email and phone exist in the DB
  const existingEmail = await UserModel.findOne({ email: req.body.email });
  const existingPhone = await UserModel.findOne({ phone: req.body.phone });
  if (existingEmail) {
    return res.status(409).json({
      status: "fail",
      message: "Email already exists",
    });
  } else if (existingPhone) {
    return res.status(409).json({
      status: "fail",
      message: "Phone number already exists",
    });
  }

  //? Hashing the user's password with bcrypt before storing in the DB
  const password = await bcrypt.hash(reqBody.password, 12);

  //? Creating a user instance
  const user = new UserModel<UserModelType>({
    first_name: reqBody.first_name,
    last_name: reqBody.last_name,
    phone: reqBody.phone,
    email: reqBody.email,
    password: password,
  });

  //? Create a JWT token with user data and my secret key
  const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

  //? Saving the user in the DB and returning a response to the user
  try {
    const newUser = await user.save();
    res.status(201).json({
      status: "Success",
      message: `${reqBody.first_name} ${reqBody.last_name} has been created`,
      token: token,
      data: newUser,
    });
  } catch (err) {
    let errMsg: string;
    if (err instanceof Error) {
      errMsg = err.message;
    } else errMsg = String(err);
    res.status(500).json({ message: "Server error: \n" + errMsg });
  }
}

async function logInUser(req: Request, res: Response, next: NextFunction) {
  /**
   * This is a controller that handles the creation of a new user
   * @param {UserModelType} parameter {
   *      first_name: String,
   *      last_name: String,
   *      phone: String, // NOTE: this must include country code
   *      email: String,
   *      password: String,
   *   } - parameter description
   *   @returns Responses:
   *       201: Success
   *       500: Server error
   */

  const reqBody: UserModelType = { ...req.body };

  //? Checking if the email already exist
  const existingEmail = await UserModel.findOne({ email: req.body.email });
  if (existingEmail) {
    return res.status(409).json({
      status: "fail",
      message: "Email already exists",
    });
  }
}

export { createUser, logInUser };
