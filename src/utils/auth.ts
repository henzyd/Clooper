import { Request, Response, NextFunction } from "express";
import { UserModel, UserModelType } from "../db/models.js";
import bcrypt from "bcryptjs";
import { signinJWT } from "../utils/token.js";

async function createUserOrAdmin(req: Request, is_admin = false) {
  /**
   * This is not a middleware or the main create user function, this is just a function used to implement the DRY principle in my code base.
   * Here I am creating a `createUserOrAdmin` function that can create a normal user or an admin instanse of the userModel and return it to the main `createUser` or `createAdmin` function so that it can be saved in the DB.
   *
   * @param req : the request object
   * @param is_admin : boolean
   *
   * @returns object containing a response data or an object containing a user or an admin data
   */

  const { first_name, last_name, email, phone, password }: UserModelType =
    req.body;

  //? Checking if the email and phone exist in the DB
  const existingEmail = await UserModel.findOne({ email: email });
  const existingPhone = await UserModel.findOne({ phone: phone });
  if (existingEmail) {
    return {
      status: "Fail",
      message: "Email already exists",
    };
  } else if (existingPhone) {
    return {
      status: "Fail",
      message: "Phone number already exists",
    };
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
    is_admin: is_admin,
  });

  //? Create a JWT token with user data and my secret key
  const token = signinJWT(user);

  return {
    user: user,
    token: token,
  };
}

async function loginUserOrAdmin(req: Request) {
  /**
   * This is not a middleware or the main login user function, this is just a function used to implement the DRY principle in my code base.
   * Here I am creating a `loginUserOrAdmin` function that checks if a user or admin exists and return an object with a response data in it or return a user or admin object
   *
   * @param req : the request object
   *
   * @returns object containing a response data or an object containing a user or an admin data
   */

  const { email, password } = req.body;

  //? Checking if the user exist and if it does exist check if the password matches the one in the DB
  const user = await UserModel.findOne({ email: email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return {
      status: "Fail",
      message: "Invalid email or password",
    };
  }

  return user;
}

export { createUserOrAdmin, loginUserOrAdmin };
