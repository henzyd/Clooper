import { Request, Response } from "express";
import { responseHandler } from "../utils/appResponse.js";

async function welcomeMessage(req: Request, res: Response) {
  responseHandler(res, 200, "Success", "Welcome to property endpoint");
}

export { welcomeMessage };
