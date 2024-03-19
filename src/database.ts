import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

// Call dotenv.config() to load the .env file
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("The MONGODB_URI must be set in environment variables");
}
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

let dbInstance: MongoClient;

export const connectDB = async () => {
  try {
    await client.connect();
    dbInstance = client; // Store the instance to use later
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
};

export const getDB = () => {
  if (!dbInstance) {
    throw new Error("Must connect to the database first!");
  }
  return dbInstance.db("notekeeper"); // Replace 'notekeeper' with your database name if different
};
