import { Router } from "express";
import NoteKeeper from "../NoteKeeper";
import { ObjectId } from "mongodb";

const router = Router();

// Add a new note
router.post("/", async (req, res, next) => {
  try {
    const { content } = req.body;
    const noteKeeper = NoteKeeper.getInstance();
    const noteId = await noteKeeper.addNote(content);
    res.status(201).send({ message: "Note added", id: noteId.toString() });
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
});

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

// GET route to fetch a note by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params; // Extract the ID from the route parameters
    const noteKeeper = NoteKeeper.getInstance();

    // Assuming you have a method getNoteById in NoteKeeper
    const note = await noteKeeper.getNoteById(new ObjectId(id));

    if (!note) {
      return res.status(404).send({ message: "Note not found" });
    }

    res.status(200).send(note);
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
});

// Update a note
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const noteKeeper = NoteKeeper.getInstance();
    const success = await noteKeeper.updateNote(new ObjectId(id), content);
    if (success) {
      res.status(200).send({ message: "Note updated successfully" });
    } else {
      res.status(404).send({ message: "Note not found" });
    }
  } catch (error) {
    next(error);
  }
});

// Delete a note
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const noteKeeper = NoteKeeper.getInstance();
    const success = await noteKeeper.deleteNote(new ObjectId(id));
    if (success) {
      res.status(200).send({ message: "Note deleted successfully" });
    } else {
      res.status(404).send({ message: "Note not found" });
    }
  } catch (error) {
    next(error);
  }
});

// Search for notes
router.get("/search", async (req, res, next) => {
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
});

export default router;
