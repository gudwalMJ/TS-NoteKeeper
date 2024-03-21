export interface User {
  id: string;
  username: string;
  password: string; // Hashed password
  iat?: number;
  exp?: number;
}
