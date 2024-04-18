import dotenv from "dotenv";

dotenv.config();

export const PORT: number = parseInt(process.env.PORT || "8000", 10);
export const MODE: string = process.env.MODE || "localhost";
export const API_V1: string = process.env.API_V1 || "/api/v1";
export const DB_URL: string = process.env.DB_URL || '';
export const JWT_SECRET: string = process.env.JWT_SECRET || '';
export const SENDBLUE_KEY: string = process.env.SENDBLUE_KEY || '';
export const FILE_BASE_URL: string =
  MODE === "localhost" ? `http://localhost:${PORT}/` : "";
