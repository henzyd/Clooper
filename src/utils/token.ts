import jwt, { JwtPayload } from "jsonwebtoken";
import ms from "ms";
import { responseHandler } from "../utils/appResponse.js";
import { Response } from "express";
import { UserModel } from "../db/models.js";

type UserReqOBJ = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
};

/**
 * This is a function that creates a new JWT token for a user
 * @returns `String` a JWT token
 */
function signinJWT(user: UserReqOBJ) {
  const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
    expiresIn: ms(process.env.JWT_EXPIRE_IN),
  });

  return token;
}

/**
 *
 * @param token
 * @param res : **Response object**
 * @returns Response object | JwtPayload object
 */
async function verifyToken(token: string, res: Response) {
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const currentUser = await UserModel.findById(decoded.user._id);
    if (!currentUser) {
      return res.status(401).json({
        message: "The user belonging to this token do not longer exist.",
      });
    }
  } catch (err) {
    return responseHandler(res, 422, "fail", "Invalid JWT token");
  }
  return decoded;
}

export { signinJWT, verifyToken };
