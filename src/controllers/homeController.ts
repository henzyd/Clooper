import { Request, Response } from "express";

async function welcomeMessage(req: Request, res: Response) {
  res.status(200).json({ message: "Welcome to property endpoint" });
}

export { welcomeMessage };
