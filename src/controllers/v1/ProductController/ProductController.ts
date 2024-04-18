import { Request, Response } from "express";
import { FILE_BASE_URL } from "../../../configs/constants";
import ProductModel from "../../../models/ModelProduct";
import mongoose from "mongoose";
export const addProduct = async (req: any, res: Response) => {
  try {
    if (req.decodedToken.role !== "admin") {
      return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "Forbidden. Admin access required.",
      });
    }
    const {
      name,
      categories,
      brands,
      hsn,
      barcode,
      tax,
      description,
      unit,
      sku,
      increment,
      weight,
      min_quantity,
      max_quantity,
      discount,
      purchase_price,
      mrp,
      expired,
      sale_price,
      stock,
    } = req.body;

    if (!name || !categories) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid request!",
        error: {},
      });
    }

    const isExist = await ProductModel.countDocuments({ name: name });

    if (isExist) {
      return res.status(409).send({
        status: false,
        statusCode: 409,
        message: "Product Already Exist!!!",
        error: {},
        data: {},
        date: new Date().toISOString(),
      });
    }

    const files: any = req.files;

    const coverFileExist: any = files?.filter(
      (i: any) => i.fieldname === "cover_file"
    );
    const allFileExist: any = files?.filter(
      (i: any) => i.fieldname === "files"
    );
    let cover_file = "";

    if (coverFileExist?.length > 0) {
      cover_file = FILE_BASE_URL + coverFileExist[0]?.path;
    }

    const allFiles: any = [];

    for (let index = 0; index < allFileExist?.length; index++) {
      const element = allFileExist[index];
      allFiles.push(FILE_BASE_URL + element?.path);
    }

    await ProductModel.create({
      name: name ? name : null,
      categories: categories ? JSON.parse(categories) : [],
      brands: brands ? JSON.parse(brands) : [],
      hsn: hsn ? hsn : null,
      barcode: barcode ? barcode : null,
      tax: tax ? parseInt(tax) : null,
      description: description ? description : null,
      unit: unit ? unit : null,
      cover_file: cover_file ? cover_file : null,
      files: allFiles,
      sku: sku ? sku : null,
      incrementC: increment ? parseFloat(increment) : 1,
      weight: weight ? parseFloat(weight) : 0,
      min_quantity: min_quantity ? parseFloat(min_quantity) : 1,
      max_quantity: max_quantity ? parseFloat(max_quantity) : 5,
      discount: discount ? parseFloat(discount) : 0,
      purchase_price: purchase_price ? parseFloat(purchase_price) : 0,
      mrp: mrp ? parseFloat(mrp) : 0,
      sale_price: sale_price ? parseFloat(sale_price) : 0,
      expired: expired ? expired : null,
      stock: stock ? parseFloat(stock) : 0,
      status: 1,
    });

    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Product Saved Successfully.",
      error: {},
      extra: {},
      data: {},
      date: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).send({
      status: false,
      statusCode: 500,
      message: "Something went wrong!!!",
      error: {
        error: error.toString(),
      },
      data: {},
      date: new Date().toISOString(),
    });
  }
};

export const deleteProduct = async (req: any, res: Response) => {
  try {
    if (req.decodedToken.role !== "admin") {
      return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "Forbidden. Admin access required.",
      });
    }
    let productId = req.params.id || "";

    if (!productId)
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid request!",
        error: {},
      });

    await ProductModel.deleteOne({
      _id: new mongoose.Types.ObjectId(productId),
    });

    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Product Deleted Successfully.",
      error: {},
      extra: {},
      data: {},
      date: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).send({
      status: false,
      statusCode: 500,
      message: "Something went wrong!!!",
      error: {
        error: error.toString(),
      },
      data: {},
      date: new Date().toISOString(),
    });
  }
};

export const viewProducts = async (req: any, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const products: any = await ProductModel.find({})
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await ProductModel.countDocuments();

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "",
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          pageSize: limit,
        },
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      statusCode: 500,
      message: "Something went wrong!!!",
      error: {
        // error: error.toString(),
      },
      data: {},
      date: new Date().toISOString(),
    });
  }
};
