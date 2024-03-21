import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/custom-request";
import dotenv from "dotenv";
import { TokenPayload } from "../types/token-payload";

dotenv.config();

export const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return res.sendStatus(401);
  }

  console.log("Token received:", token);

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err.message);
      return res.sendStatus(403);
    }

    const payload = decoded as TokenPayload; // Ensure TokenPayload reflects the actual structure
    if (payload && payload.id && payload.username) {
      req.user = { id: payload.id, username: payload.username };
      next();
    } else {
      console.log("Invalid token payload:", payload);
      return res.sendStatus(403);
    }
  });
};
