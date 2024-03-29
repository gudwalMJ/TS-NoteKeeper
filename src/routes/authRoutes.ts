// src/routes/authRoutes.ts
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, fetchUserByUsername } from "../db/userOperations";
import { authenticateToken } from "../middleware/authenticateToken";
import { CustomRequest } from "../types/custom-request";

const router = express.Router();

// REGISTER
router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await createUser(username, hashedPassword);
    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, username: newUser.username },
    });
  } catch (error) {
    // Use type assertion
    const message = (error as Error).message;
    res.status(400).json({ message });
  }
});

// LOGIN
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await fetchUserByUsername(username);

  if (user && (await bcrypt.compare(password, user.password))) {
    // User authenticated successfully
    if (typeof process.env.JWT_SECRET === "undefined") {
      throw new Error("JWT_SECRET is not set");
    }
    console.log("JWT Secret (authRoutes.ts):", process.env.JWT_SECRET); // Added line

    // Include user's id and username in the JWT payload
    const userForToken = {
      id: user._id, // Make sure this matches the property used in your user model
      username: user.username,
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Generated JWT token:", token); // Added for verification

    res.json({ message: "Login successful", token });
  } else {
    // Authentication failed
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// PROTECTED
router.get(
  "/protected",
  authenticateToken,
  (req: CustomRequest, res: Response) => {
    console.log("req.user:", req.user); // Log the entire user object

    // Optionally, log specific properties for verification
    if (req.user) {
      console.log("User ID:", req.user.id);
      console.log("Username:", req.user.username);
    }
    res.json({ message: "Welcome to the protected route!" });
  }
);
export default router;
