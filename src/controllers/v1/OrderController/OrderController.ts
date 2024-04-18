import { Request, Response } from "express";
import mongoose from "mongoose";
import CartModel from "../../../models/ModelCart";
import ProductModel from "../../../models/ModelProduct";
import OrdersModel from "../../../models/ModelOrder";
import { v4 as uuidv4 } from "uuid";
import OrderDetailsModel from "../../../models/ModelOrderDetails";

export const addToCart = async (req: any, res: Response) => {
  try {
    let { productId, qty } = req?.body;

    const userId = req.decodedToken.userId;

    const product: any = await ProductModel.findOne({
      _id: new mongoose.Types.ObjectId(productId),
    });

    let cartData: any = await CartModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId),
    });

    if (cartData) {
      cartData.quantity += parseFloat(qty ? qty : product.incrementC);
      await cartData.save();
    } else {
      cartData = await CartModel.create({
        userId: userId,
        productId: productId,
        productName: product.name,
        quantity: parseFloat(qty ? qty : product.min_quantity),
        sale_price: product.sale_price,
      });
    }

    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Product Added to Cart Successfully.",
      error: {},
      extra: {},
      data: { cartData },
      date: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
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

export const createOrder = async (req: any, res: Response) => {
  try {
    const { deliveryMethod, channel, shippingCharge, address } = req?.body;
    const userId = req.decodedToken.userId;

    let cartData: any = await CartModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    const orderCount = await OrdersModel.countDocuments({});

    const orderNumber = "order" + "_" + (orderCount + 1001);
    const invoiceNumber = "INV" + "_" + (orderCount + 1001);

    let orderStatus = "Received";
    let grandTotal = 0;
    let discount = 0;
    let taxAmount = 0;
    let deliveryDateTime = 0;
    let orderDetails: any = [];

    const date = new Date();

    const order: any = {
      orderNumber: orderNumber,
      invoice: invoiceNumber,
      total_items: cartData.length,
      isPaid: 0,
      userId: new mongoose.Types.ObjectId(userId),
      address: address,
      grandTotal: grandTotal,
      discount: discount,
      channel: channel,
      shippingCharge: shippingCharge,
      deliveryMethod: deliveryMethod,
      payment_method: "COD",
      tax_amount: taxAmount,
      transaction_id: uuidv4(),
      delivery_date_time: deliveryDateTime,
      orderStatus: orderStatus,
      createdAt: date,
      updatedAt: date,
      status: 1,
    };

    const orderData = await OrdersModel.create(order);

    for (let index = 0; index < cartData.length; index++) {
      const element = cartData[index];
      const product: any = await ProductModel.findOne({
        _id: new mongoose.Types.ObjectId(element.productId),
      });
      grandTotal = grandTotal + element.sale_price * element.quantity;
      const disc = product?.mrp - element?.sale_price;
      discount = discount + (disc > 0 ? disc * element.quantity : 0);
      const unitTax =
        ((element.sale_price * element.quantity) / (1 + product.tax / 100)) *
        (product.tax / 100);
      taxAmount = taxAmount + unitTax;
      orderDetails.push({
        orderId: new mongoose.Types.ObjectId(orderData._id),
        orderNumber: orderNumber,
        name: element.productName,
        file: element.file,
        tax: unitTax,
        unit: product.unit,
        quantity: element.quantity,
        unitPrice: element.sale_price,
        discount: disc > 0 ? disc : 0,
        subTotal: element.sale_price * element.quantity,
        productId: element?.productId,
        createdAt: date,
        updatedAt: date,
        status: 1,
      });
    }

    await OrderDetailsModel.insertMany(orderDetails);

    res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Order Placed",
      error: {},
      extra: {},
      data: {},
      date: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
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

export const getOrders = async (req: any, res: Response) => {
  const isAdmin = req.decodedToken.role === "admin";
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const orderStatus = req.query.orderStatus || "";

    const skip = (page - 1) * limit;

    let pipeLine: any = [];

    if (orderStatus) {
      pipeLine.push({
        $match: {
          orderStatus: orderStatus,
        },
      });
    }
    pipeLine.push({
      $lookup: {
        from: "orderdetails",
        localField: "_id",
        foreignField: "orderId",
        as: "orderDetails",
      },
    });

    if (isAdmin) {
      pipeLine.push({
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      });
    }

    pipeLine.push({ $skip: skip });
    pipeLine.push({ $limit: limit });

    const orders: any = await OrdersModel.aggregate(pipeLine);

    const totalCount = await OrdersModel.countDocuments();

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "",
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          pageSize: limit,
        },
      },
    });
  } catch (error) {
    console.log(error);
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
