import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
    if (err) return res.sendStatus(403); // Token is not valid

    // Ensure the payload matches the expected structure
    const user = payload as User; // Assuming the JWT payload is structured as User
    if (!user || !user.id || !user.username) {
      return res.sendStatus(403); // Invalid token payload
    }

    req.user = user;
    next();
  });
};
