import { Request, Response, NextFunction } from "express";
import { API_V1 } from "../configs/constants";
import { test } from "../controllers/test";
import {
  addProduct,
  deleteProduct,
  viewProducts,
} from "../controllers/v1/ProductController/ProductController";
import {
  login,
  register,
} from "../controllers/v1/UserController/UserController";
import { verifyToken } from "../configs/globalFunctions";
import {
  addToCart,
  createOrder,
  getOrders,
} from "../controllers/v1/OrderController/OrderController";

interface Route {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  isFileUpload: boolean;
  isMiddleWare: boolean;
  handler: (req: Request, res: Response) => void;
  middleware: (req: Request, res: Response, next: NextFunction) => void;
}
export const allRoutes: Route[] = [
  {
    method: "GET",
    isMiddleWare: false,
    middleware: () => {},
    isFileUpload: false,
    path: "/",
    handler: test,
  },
  {
    method: "POST",
    isFileUpload: false,
    isMiddleWare: false,
    middleware: () => {},
    path: `${API_V1}/register`,
    handler: register,
  },
  {
    method: "POST",
    isFileUpload: false,
    isMiddleWare: false,
    middleware: () => {},

    path: `${API_V1}/login`,
    handler: login,
  },
  {
    method: "POST",
    isMiddleWare: true,
    isFileUpload: true,
    middleware: verifyToken,
    path: `${API_V1}/add-product`,
    handler: addProduct,
  },
  {
    method: "DELETE",
    isMiddleWare: true,
    isFileUpload: true,
    middleware: verifyToken,
    path: `${API_V1}/delete-product/:id`,
    handler: deleteProduct,
  },
  {
    method: "GET",
    isMiddleWare: true,
    isFileUpload: true,
    middleware: verifyToken,
    path: `${API_V1}/get-all-product`,
    handler: viewProducts,
  },
  {
    method: "POST",
    isMiddleWare: true,
    isFileUpload: true,
    middleware: verifyToken,
    path: `${API_V1}/add-to-cart`,
    handler: addToCart,
  },
  {
    method: "POST",
    isMiddleWare: true,
    isFileUpload: true,
    middleware: verifyToken,
    path: `${API_V1}/create-order`,
    handler: createOrder,
  },
  {
    method: "GET",
    isMiddleWare: true,
    isFileUpload: true,
    middleware: verifyToken,
    path: `${API_V1}/get-all-order`,
    handler: getOrders,
  },
];
