import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../utils/constants";
import { Request, Response } from "express";

export const createToken = (id: unknown) => {
  const jwtToken = jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return jwtToken;
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET);

  return decoded;
};

export const tokenAuth = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return null;
  }
  
  return token;
}