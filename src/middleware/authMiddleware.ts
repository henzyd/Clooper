import { Request, Response, NextFunction } from "express";
import { phone as phoneCheck } from "phone";
import validator from "validator";
import { UserModel } from "../db/models.js";
import jwt from "jsonwebtoken";
import { responseHandler } from "../utils/appResponse.js";

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
    return responseHandler(res, 400, "Error", "First name is required");
  } else if (!last_name) {
    return responseHandler(res, 400, "Error", "Lst name is required");
  } else if (!email) {
    return responseHandler(res, 400, "Error", "Email is required");
  } else if (!phone) {
    return responseHandler(res, 400, "Error", "Phone is required");
  } else if (!password) {
    return responseHandler(res, 400, "Error", "Password is required");
  }

  //? Checking if the email and phone are valid
  const emailIsValid = validator.default.isEmail(email);
  const phoneObj = phoneCheck(phone);
  const phoneIsValid = phoneObj.isValid;
  if (!emailIsValid || !phoneIsValid) {
    return responseHandler(res, 422, "Error", "Invalid email or phone");
  }

  //? Check if password is meet the expected length
  if (password.length < 8) {
    return responseHandler(
      res,
      400,
      "Error",
      "Password must be at least 8 characters long"
    );
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
    return responseHandler(
      res,
      400,
      "error",
      "Email and password are required"
    );
  }

  //? Check if the email and password are valid
  const emailIsValid = validator.default.isEmail(req.body.email);
  const passwordIsValid = validator.default.isLength(req.body.password, {
    min: 8,
  });
  if (!emailIsValid || !passwordIsValid) {
    return responseHandler(res, 422, "Fail", "Invalid email or password");
  }

  next();
}

async function protectRoute(req: Request, res: Response, next: NextFunction) {
  /**
   * This middleware is used to make sure that only authenticated users are able to access routes
   */
  let token: string = "";
  const bearerToken = req.headers.authorization;
  if (bearerToken && bearerToken.startsWith("Bearer")) {
    token = bearerToken.split(" ")[1];
  }
  if (!token) {
    return responseHandler(
      res,
      401,
      "Fail",
      "You need to be logged in to access this"
    );
  }
  let currentUser;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY);

    currentUser = await UserModel.findById(decoded.user._id).select([
      "+is_admin",
      "+is_active",
    ]);

    if (!currentUser?.is_active) {
      return responseHandler(res, 401, "Fail", "This user is not active");
    }

    if (!currentUser) {
      return responseHandler(
        res,
        401,
        "Fail",
        "The user belonging to this token do not longer exist."
      );
    }
  } catch (err) {
    return responseHandler(res, 422, "Fail", "Invalid JWT token");
  }

  res.locals.currentUser = currentUser;

  next();
}

export { createUserMiddleware, loginMiddleware, protectRoute };
