import { Request, Response, NextFunction } from "express";

interface iLogger {
  method: string;
  path: string;
  timestamp: string;
}

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const meta: iLogger = {
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString(),
  };
  console.info(JSON.stringify(meta));
  next();
};
