import { Router, Request, Response, NextFunction } from "express";
import { body, param, validationResult, query } from "express-validator";
import NoteKeeper from "../NoteKeeper";
import { NotFoundError, ValidationError } from "../utils/errors";
import { ObjectId } from "mongodb";

const router = Router();

// Add a new note with validation
router.post(
  "/",
  // Step 1: Validation middleware
  [body("content").trim().notEmpty().withMessage("Content must not be empty")],
  // Step 2: Route handler
  async (req: Request, res: Response, next: NextFunction) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Proceed with your original logic after validation passes
    try {
      const { content } = req.body;
      const noteKeeper = NoteKeeper.getInstance();
      const noteId = await noteKeeper.addNote(content);
      res.status(201).send({ message: "Note added", id: noteId.toString() });
    } catch (error) {
      next(error); // Pass errors to the global error handler
    }
  }
);

// List all notes
router.get("/", async (req, res, next) => {
  try {
    const noteKeeper = NoteKeeper.getInstance();
    const notes = await noteKeeper.listNotes();
    res.status(200).send(notes);
  } catch (error) {
    next(error);
  }
});

// Search for notes
router.get(
  "/search",
  [query("query").notEmpty().withMessage("Search query must not be empty")],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req.query;
      if (typeof query !== "string") {
        return res.status(400).send({ message: "Invalid search query" });
      }
      const noteKeeper = NoteKeeper.getInstance();
      const notes = await noteKeeper.searchNotes(query);
      res.status(200).send(notes);
    } catch (error) {
      next(error);
    }
  }
);

// GET route to fetch a note by ID with validation
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID format")],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const noteKeeper = NoteKeeper.getInstance();
      const note = await noteKeeper.getNoteById(new ObjectId(id));

      if (!note) {
        throw new NotFoundError("Note not found");
      }

      res.status(200).send(note);
    } catch (error) {
      next(error);
    }
  }
);

// Update a note with validation
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid ID format"),
    body("content").trim().notEmpty().withMessage("Content must not be empty"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const noteKeeper = NoteKeeper.getInstance();
      const success = await noteKeeper.updateNote(new ObjectId(id), content);

      if (!success) {
        throw new NotFoundError("Note not found");
      }

      res.status(200).send({ message: "Note updated successfully" });
    } catch (error) {
      next(error);
    }
  }
);

// Delete a note
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID format")],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const noteKeeper = NoteKeeper.getInstance();
      const success = await noteKeeper.deleteNote(new ObjectId(id));

      if (!success) {
        throw new NotFoundError("Note not found");
      }

      res.status(200).send({ message: "Note deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
