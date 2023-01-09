import { Request, Response, NextFunction } from "express";
import { UserModel, UserModelType } from "../db/models.js";
import validator from "validator";

type Req$ResType = {
  req: Request;
  res: Response;
  next: NextFunction;
};

async function getAllUsers(Req$Res: Req$ResType) {
  try {
    const users = await UserModel.find();
    Req$Res.res.status(200).json({
      status: "Success",
      users: users,
    });
  } catch (err) {
    Req$Res.res.status(500).json({ message: "Server error" });
  }
}

export { getAllUsers };
