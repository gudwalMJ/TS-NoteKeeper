import express, { Request, Response, NextFunction } from "express";

import notesRoutes from "./routes/notesRoutes"; // Import your modularized routes
import dotenv from "dotenv";
dotenv.config();

// Ensure the database connection is established at startup
import { connectDB } from "./database";
connectDB().then(() => console.log("Connected to database"));

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware for parsing JSON bodies

// Use the modularized notes routes
app.use("/notes", notesRoutes); // All notes-related routes are now handled in notesRoutes

// Define a simple route for demo
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const status = (err as any).status || 500; // Cast err to any to access custom properties like status
  const message = err.message || "Something went wrong.";
  res.status(status).send({ error: message });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
