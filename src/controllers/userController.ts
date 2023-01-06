import { Request, Response } from "express";
import { UserModel, UserModelType } from "../db/models.js";

type Req$ResType = {
  req: Request;
  res: Response;
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

async function createUser(Req$Res: Req$ResType) {
  const reqBody: UserModelType = { ...Req$Res.req.body };
  const user = new UserModel<UserModelType>({
    first_name: reqBody.first_name,
    last_name: reqBody.last_name,
    phone: reqBody.phone,
    password: reqBody.password,
    email: reqBody.email,
    is_admin: reqBody.is_admin,
    is_active: reqBody.is_active,
  });

  try {
    const newUser = await user.save();
    Req$Res.res.status(201).json({
      status: "Success",
      message: `${newUser.first_name} ${newUser.last_name} has been created`,
    });
  } catch (err) {
    Req$Res.res.status(500).json({ message: "Server error" });
  }
}

export { getAllUsers, createUser };
