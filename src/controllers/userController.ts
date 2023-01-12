import { Request, Response, NextFunction } from "express";
import { UserModel } from "../db/models.js";
import { responseHandler } from "../utils/appResponse.js";
import { serverErrorResponse } from "../utils/appResponse.js";

type Req$ResType = {
  req: Request;
  res: Response;
  next: NextFunction;
};

async function getAllUsers(Req$Res: Req$ResType) {
  /**
   * This controller is responsible for getting all users in the database this also includes an admin
   */

  try {
    const users = await UserModel.find();
    responseHandler(Req$Res.res, 200, "Success", undefined, users);
  } catch (err) {
    Req$Res.res.status(500).json({ message: "Server error" });
    const errMsg = serverErrorResponse(err);
    Req$Res.res.status(500).json({ message: "Server error: " + errMsg });
  }
}

export { getAllUsers };
