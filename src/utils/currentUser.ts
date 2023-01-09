import jwt, { JwtPayload } from "jsonwebtoken";
import { responseHandler } from "../utils/appResponse.js";
import { UserModel, UserModelType } from "../db/models.js";
import { Response } from "express";

/**
 *
 * @param token
 * @param secret
 * @returns Response object | JwtPayload object
 */
async function getCurrentUser(token: string, res: Response) {
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return responseHandler(res, 422, "fail", "Invalid JWT token");
  }
  const currentUser: UserModelType | null = await UserModel.findById(
    decoded.user._id
  );
  if (!currentUser) {
    return  null
  }
  return currentUser;
}

export { getCurrentUser };
