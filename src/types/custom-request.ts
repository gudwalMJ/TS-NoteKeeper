import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

export interface CustomRequest extends Request {
  user?: User; // Optional user property
}
