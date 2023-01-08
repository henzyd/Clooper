import { Request, Response, NextFunction } from "express";
import { UserModel, UserModelType } from "../db/models.js";
import bcrypt from "bcryptjs";
import { serverErrorResponse } from "../utils/appResponse.js";
import { signinJWT } from "../utils/token.js";

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

  const { first_name, last_name, email, phone, password }: UserModelType =
    req.body;

  //? Checking if the email and phone exist in the DB
  const existingEmail = await UserModel.findOne({ email: email });
  const existingPhone = await UserModel.findOne({ phone: phone });
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
  const hashedPassword = await bcrypt.hash(password, 12);

  //? Creating a user instance
  const user = new UserModel({
    first_name: first_name,
    last_name: last_name,
    phone: phone,
    email: email,
    password: hashedPassword,
  });

  //? Create a JWT token with user data and my secret key
  const token = signinJWT(user);

  //? Saving the user in the DB and returning a response to the user
  try {
    const newUser = await user.save();
    res.status(201).json({
      status: "Success",
      message: `${first_name} ${last_name} has been created`,
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
       201: Success
       500: Server error
   */

  const { email, password } = req.body;

  //? Checking if the user exist and if it does exist check if the password matches the one in the DB
  const user = await UserModel.findOne({ email: email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid email or password",
    });
  }

  try {
    const token = signinJWT(user);
    res.status(201).json({
      status: "Success",
      message: `${user.first_name} ${user.last_name} has been logged in successfully`,
      token,
    });
  } catch (err) {
    const errMsg = serverErrorResponse(err);
    res.status(500).json({ message: "Server error \n", errMsg });
  }
}

export { createUser, logInUser };
