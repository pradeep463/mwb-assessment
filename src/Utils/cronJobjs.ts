import OrdersModel from "../models/ModelOrder";
import { genContent } from "./genarateContent";
import axios from "axios";
import { SENDBLUE_KEY } from "../configs/constants";

export const sendMailToAdmins = async () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  let pipeLine = [
    {
      $match: {
        orderStatus: "Received",
        createdAt: { $gte: date },
      },
    },
    {
      $lookup: {
        from: "orderdetails",
        localField: "_id",
        foreignField: "orderId",
        as: "orderDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
  ];

  const orders: any = await OrdersModel.aggregate(pipeLine);

  let data = JSON.stringify({
    sender: {
      name: "MWB",
      email: "pradeephegde463@gmail.com",
    },
    to: [
      {
        email: "pradeephegde463@gmail.com",
        name: "Pradeep",
      },
    ],
    htmlContent: await genContent(orders),
    subject: "Orders Received Today",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.brevo.com/v3/smtp/email",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": SENDBLUE_KEY,
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

  return;
};
