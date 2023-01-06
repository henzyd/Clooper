import { Request, Response } from "express";

function welcomeMessage(req: Request, res: Response) {
  res.status(200).json({ message: "Welcome to property endpoint" });
}

export { welcomeMessage };
