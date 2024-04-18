import { Request, Response, NextFunction } from "express";

interface ErrorResponse {
  status: boolean;
  statusCode: number;
  message: string;
  error: any;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const errorResponse: ErrorResponse = {
    status: false,
    statusCode: 500,
    message: "Something went wrong!!!",
    error: {},
  };

  if (err instanceof Error) {
    errorResponse.message = err.message;
    errorResponse.error = err;
  }

  res.status(500).json(errorResponse);
};
