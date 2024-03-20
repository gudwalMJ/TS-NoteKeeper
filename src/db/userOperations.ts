import { getDB } from "./database";
import { ObjectId } from "mongodb";

/**
 * Creates a new user in the database.
 * @param username The username of the new user.
 * @param hashedPassword The hashed password of the new user.
 * @returns The created user document.
 */
export const createUser = async (username: string, hashedPassword: string) => {
  const db = getDB();
  const collection = db.collection("users");

  // Check if the user already exists
  const existingUser = await collection.findOne({ username });
  if (existingUser) {
    throw new Error("Username already exists");
  }

  // Insert the new user
  const result = await collection.insertOne({
    username,
    password: hashedPassword,
  });
  const userId = result.insertedId;
  const newUser = await collection.findOne({ _id: userId });

  // Ensure newUser is not null before returning
  if (!newUser) {
    throw new Error("Failed to retrieve newly created user.");
  }

  return newUser;
};

/**
 * Fetches a user by their username.
 * @param username The username of the user to find.
 * @returns The found user document or null if no user is found.
 */
export const fetchUserByUsername = async (username: string) => {
  const db = getDB();
  const collection = db.collection("users");

  return await collection.findOne({ username });
};
