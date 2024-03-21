import { Request } from "express";

interface AuthenticatedUser {
  id: string;
  username: string;
}

export interface CustomRequest extends Request {
  user?: AuthenticatedUser; // Updated to use AuthenticatedUser
}
