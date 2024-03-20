import { getDB } from "./database";
import { ObjectId } from "mongodb";

type Note = {
  _id?: ObjectId;
  content: string;
};

class NoteKeeper {
  private static instance: NoteKeeper;
  private collectionName: string = "notes";

  private constructor() {}

  public static getInstance(): NoteKeeper {
    if (!NoteKeeper.instance) {
      NoteKeeper.instance = new NoteKeeper();
    }
    return NoteKeeper.instance;
  }

  async addNote(content: string): Promise<ObjectId> {
    try {
      const db = getDB();
      const collection = db.collection<Note>(this.collectionName);
      const result = await collection.insertOne({ content });
      return result.insertedId;
    } catch (error) {
      console.error("Failed to add note:", error);
      throw new Error("Could not add note due to a database error.");
    }
  }

  async deleteNote(_id: ObjectId): Promise<boolean> {
    try {
      const db = getDB();
      const collection = db.collection<Note>(this.collectionName);
      const result = await collection.deleteOne({ _id });
      if (result.deletedCount === 0) {
        throw new Error("Note not found");
      }
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw new Error("Could not delete note due to a database error.");
    }
  }

  async listNotes(): Promise<Note[]> {
    try {
      const db = getDB();
      const collection = db.collection<Note>(this.collectionName);
      return await collection.find({}).toArray();
    } catch (error) {
      console.error("Failed to list notes:", error);
      throw new Error("Could not list notes due to a database error.");
    }
  }

  async updateNote(_id: ObjectId, content: string): Promise<boolean> {
    try {
      const db = getDB();
      const collection = db.collection<Note>(this.collectionName);
      const result = await collection.updateOne({ _id }, { $set: { content } });
      if (result.modifiedCount === 0) {
        throw new Error("Note not found or content unchanged");
      }
      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Failed to update note:", error);
      throw new Error("Could not update note due to a database error.");
    }
  }

  async createTextIndex(): Promise<void> {
    try {
      const db = getDB();
      const collection = db.collection(this.collectionName);
      await collection.createIndex({ content: "text" });
      console.log("Text index created on 'content'");
    } catch (error) {
      console.error("Failed to create text index:", error);
      throw new Error("Could not create text index due to a database error.");
    }
  }

  async searchNotes(searchQuery: string): Promise<Note[]> {
    try {
      const db = getDB();
      const collection = db.collection<Note>(this.collectionName);

      // Using MongoDB's $text and $search for full-text search
      const notes = await collection
        .find({ $text: { $search: searchQuery } })
        .toArray();
      return notes;
    } catch (error) {
      console.error("Failed to search notes:", error);
      throw new Error("Could not search notes due to a database error.");
    }
  }
}
export default NoteKeeper;
