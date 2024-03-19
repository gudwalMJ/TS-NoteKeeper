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
    const db = getDB();
    const collection = db.collection<Note>(this.collectionName);
    const result = await collection.insertOne({ content });
    return result.insertedId;
  }

  async deleteNote(_id: ObjectId): Promise<boolean> {
    const db = getDB();
    const collection = db.collection<Note>(this.collectionName);
    const result = await collection.deleteOne({ _id });
    return result.deletedCount > 0;
  }

  async listNotes(): Promise<Note[]> {
    const db = getDB();
    const collection = db.collection<Note>(this.collectionName);
    return collection.find({}).toArray();
  }

  async updateNote(_id: ObjectId, content: string): Promise<boolean> {
    const db = getDB();
    const collection = db.collection<Note>(this.collectionName);
    const result = await collection.updateOne({ _id }, { $set: { content } });
    return result.modifiedCount > 0;
  }
}
export default NoteKeeper;
