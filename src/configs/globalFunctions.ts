import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./constants";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      statusCode: 401,
      message: "Unauthorized. Token not provided.",
      error: {},
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    (req as any).decodedToken = decoded;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({
      status: false,
      statusCode: 401,
      message: "Unauthorized. Invalid token.",
      //   error: error.toString(),
    });
  }
};

