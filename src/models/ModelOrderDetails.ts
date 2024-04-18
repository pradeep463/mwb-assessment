import mongoose, { Schema, Document, Types } from "mongoose";

interface IOrderDetails extends Document {
  orderId: Types.ObjectId;
  orderNumber: string;
  name: string;
  file: string;
  tax: number;
  unit: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subTotal: number;
  productId: Types.ObjectId;
  createdAt: Date | null;
  updatedAt: Date | null;
  status: number;
}

const orderDetailsSchema: Schema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Orders",
    required: true,
  },
  orderNumber: String,
  name: String,
  file: String,
  tax: { type: Number, default: 0 },
  unit: String,
  quantity: { type: Number, default: 0 },
  unitPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  subTotal: { type: Number, default: 0 },
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  status: Number,
  createdAt: { type: Date, default: null },
  updatedAt: { type: Date, default: null },
});

const OrderDetailsModel = mongoose.model<IOrderDetails>(
  "OrderDetails",
  orderDetailsSchema
);

export default OrderDetailsModel;
