import NoteKeeper from "./NoteKeeper";
import { connectDB } from "./database";
import { ObjectId } from "mongodb";

// This is an immediately invoked function expression (IIFE) that allows us to use async/await at the top level
(async () => {
  try {
    // First, establish a connection to the database
    await connectDB();

    // Get the singleton instance of NoteKeeper
    const noteKeeper = NoteKeeper.getInstance();

    // Create the text index - you only need to do this once
    // Comment this out after the first successful run to avoid attempting to recreate the index
    // await noteKeeper.createTextIndex();

    // Add a new note and get its ID
    const noteId = await noteKeeper.addNote("This is a test note.");
    console.log(`Added note with ID: ${noteId}`);

    // Optionally, add more notes to test the search functionality more extensively
    await noteKeeper.addNote("Another test note for searching.");
    await noteKeeper.addNote("A note with different content.");

    console.log("Listing all notes:");
    const notes = await noteKeeper.listNotes();
    console.log(notes);

    // Perform a full-text search
    const searchQuery = "test"; // Adjust the search term as needed
    console.log(`Performing a search for: ${searchQuery}`);
    const searchResults = await noteKeeper.searchNotes(searchQuery);
    console.log(`Search results for "${searchQuery}":`, searchResults);

    // Update the note with new content
    const wasUpdated = await noteKeeper.updateNote(
      new ObjectId(noteId),
      "Updated content."
    );
    console.log(`Note updated: ${wasUpdated}`);

    // Delete the note
    const wasDeleted = await noteKeeper.deleteNote(new ObjectId(noteId));
    console.log(`Note deleted: ${wasDeleted}`);

    // List notes again to confirm deletion
    const updatedNotes = await noteKeeper.listNotes();
    console.log("Updated note list:", updatedNotes);
  } catch (error) {
    console.error("Error during NoteKeeper operations:", error);
  }
})();
