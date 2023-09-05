import * as dotenv from "dotenv";
dotenv.config();

// Environment variables
export const MYSQL_HOST = process.env.MYSQL_HOST;
export const MYSQL_PORT = process.env.MYSQL_PORT;
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
export const MYSQL_USER = process.env.MYSQL_USER;
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
export const JWT_SECRET = process.env.JWT_SECRET;

// Common variables
export const PORT = 3001;

// Error message
export const INTERNAL_SERVER_ERROR = "Internal Server Error";