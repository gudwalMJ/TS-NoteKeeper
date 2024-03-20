import express from "express";

const app = express();
const port = 3000;

app.use(express.json()); // Middleware for parsing JSON bodies

// Define a simple route for demo
app.get("/", (req, res) => {
  res.send("Hello world");

  // Start the Express server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
