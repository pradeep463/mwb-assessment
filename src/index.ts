import express, { Express, Request, Response } from "express";
import { errorHandler } from "./middleware/middleware";
import { logger } from "./middleware/logger";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import { allRoutes } from "./routes/allRoutes";
import { DB_URL, PORT } from "./configs/constants";
import mongoose from "mongoose";
import path from "path";
import cron from "node-cron";
import { sendMailToAdmins } from "./Utils/cronJobjs";

const app: Express = express();
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const isExistUploadDirectory = (req: Request, res: Response, next: any) => {
  const uploadsDir = "./uploads";
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  next();
};

app.use(isExistUploadDirectory);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "uploads/");
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(logger);

app.use(errorHandler);

allRoutes.forEach((route) => {
  if (route.isMiddleWare) {
    if (route.method === "GET") {
      app.get(route.path, route.middleware, route.handler);
    } else if (route.method === "POST" && route.isFileUpload) {
      app.post(route.path, upload.any(), route.middleware, route.handler);
    } else if (route.method === "POST") {
      app.post(route.path, route.middleware, route.handler);
    } else if (route.method === "DELETE") {
      app.delete(route.path, route.middleware, route.handler);
    } else if (route.method === "PUT") {
      app.put(route.path, route.middleware, route.handler);
    }
  } else {
    if (route.method === "GET") {
      app.get(route.path, route.handler);
    } else if (route.method === "POST" && route.isFileUpload) {
      app.post(route.path, upload.any(), route.handler);
    } else if (route.method === "POST") {
      app.post(route.path, route.handler);
    } else if (route.method === "DELETE") {
      app.delete(route.path, route.handler);
    } else if (route.method === "PUT") {
      app.put(route.path, route.handler);
    }
  }
});

mongoose.connect(DB_URL).then(() => {
  cron.schedule("0 22 * * *", sendMailToAdmins);
  console.log("DB Connected!");
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at ${PORT}`);
});
