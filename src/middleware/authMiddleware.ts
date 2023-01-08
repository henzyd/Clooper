import { Request, Response, NextFunction } from "express";
import { phone as phoneCheck } from "phone";
import validator from "validator";
import { UserModelType } from "../db/models.js";

async function createUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /**
   * This is a middleware that handles users input validation
   */

  const { first_name, last_name, email, phone, password } = req.body;

  //? Check if all keys in req.body is present
  if (!first_name) {
    return res.status(400).json({
      status: "error",
      message: "First name is required",
    });
  } else if (!last_name) {
    return res.status(400).json({
      status: "error",
      message: "Last name is required",
    });
  } else if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Email is required",
    });
  } else if (!phone) {
    return res.status(400).json({
      status: "error",
      message: "Phone number is required",
    });
  } else if (!password) {
    return res.status(400).json({
      status: "error",
      message: "Password is required",
    });
  }

  //? Checking if the email and phone are valid
  const emailIsValid = validator.default.isEmail(email);
  const phoneObj = phoneCheck(phone);
  const phoneIsValid = phoneObj.isValid;
  if (!emailIsValid || !phoneIsValid) {
    return res.status(422).json({
      status: "error",
      message: "Invalid email or phone",
    });
  }

  //? Check if password is meet the expected length
  if (password.length < 8) {
    return res.status(400).json({
      status: "error",
      message: "Password must be at least 8 characters long",
    });
  }

  next();
}

async function loginMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /**
   * This middleware is used to check if the user input is valid
   */
  const { email, password } = req.body;

  //? Check if email and password keys is present
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  //? Check if the email and password are valid
  const emailIsValid = validator.default.isEmail(req.body.email);
  const passwordIsValid = validator.default.isLength(req.body.password, {
    min: 8,
  });
  if (!emailIsValid || !passwordIsValid) {
    return res.status(422).json({
      status: "fail",
      message: "Invalid email or password",
    });
  }

  next();
}

function protectRoute(req: Request, res: Response, next: NextFunction) {
  let token: string = "";
  const bearerToken = req.headers.authorization;
  if (bearerToken && bearerToken.startsWith("Bearer")) {
    token = bearerToken.split(" ")[1];
    console.log(token);
  }
  if (!token) {
    res.status(401).json({
      status: "fail",
      message: "You need to be logged in to access this",
    });
  }
  next();
}

export { createUserMiddleware, loginMiddleware, protectRoute };
