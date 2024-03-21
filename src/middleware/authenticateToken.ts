import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { CustomRequest } from "../types/custom-request";
import dotenv from "dotenv";
dotenv.config();

export const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    console.log("No token provided");
    return res.sendStatus(401);
  }

  console.log("Token received:", token);

  jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
    if (err) {
      console.error("Token verification error:", err.message);
      return res.sendStatus(403);
    }

    const user = payload as User;
    if (!user || !user.id || !user.username) {
      console.log("Invalid token payload:", payload);
      return res.sendStatus(403);
    }

    console.log("Token is valid, user payload:", user);
    req.user = user;
    next();
  });
};
