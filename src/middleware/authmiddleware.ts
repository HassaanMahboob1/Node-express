import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/users";
import { Request, Response, NextFunction } from "express";

export const SECRET_KEY: string = "abcd";

export interface AuthenticatedRequest extends Request {
  user?: {
    // Note the use of optional chaining here
    role?: string;
    // Add more properties as needed
  };
}

// Middleware to check JWT
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // No token found

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.sendStatus(404); // User not found
    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(403); // Invalid token
  }
};

export const IsAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  console.log(req.user?.role);
  if (req.user?.role?.toUpperCase() === "ADMIN") {
    next();
  }

  return res.status(401).send("Unauthorized!");
};
export const IsUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role?.toUpperCase() === "USER") {
    next();
  }
  return res.status(401).send("Unauthorized!");
};
