import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { NotFoundError, ValidationError } from "./utils/errors";
import notesRoutes from "./routes/notesRoutes"; // Import your modularized routes
import dotenv from "dotenv";
dotenv.config();

// Ensure the database connection is established at startup
import { connectDB } from "./database";
connectDB().then(() => console.log("Connected to database"));

const app = express();
const port = process.env.PORT || 3000;
// Use morgan for logging HTTP requests
app.use(morgan("tiny"));

app.use(express.json()); // Middleware for parsing JSON bodies

// Use the modularized notes routes
app.use("/notes", notesRoutes); // All notes-related routes are now handled in notesRoutes

// Define a simple route for demo
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  // Handle custom errors
  if (err instanceof NotFoundError || err instanceof ValidationError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Default to 500 server error for unhandled errors
  const status = 500;
  const message = "Something went wrong.";
  res.status(status).json({ message });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
