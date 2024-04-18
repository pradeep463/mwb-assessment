import mongoose, { Schema, Document } from "mongoose";

// Define TypeScript interface for the Orders document
interface IOrder extends Document {
  orderNumber: string;
  invoice: string;
  total_items: number;
  isPaid: number;
  userId: mongoose.Types.ObjectId;
  address: {
    street: string;
    city: string;
    pin: string;
    address: string;
  };
  grandTotal: number;
  discount: number;
  channel: string;
  shippingCharge: number;
  deliveryMethod: string;
  paymentMethod: string;
  taxAmount: number;
  deliveryPartnerId: number;
  transactionId: string;
  deliveryDateTime: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  orderStatus: string;
  status: number;
}

const orderSchema: Schema = new Schema({
  orderNumber: String,
  invoice: String,
  total_items: { type: Number, default: 0 },
  isPaid: { type: Number, default: 0 },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    street: String,
    city: String,
    pin: String,
    address: String,
  },
  grandTotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  channel: { type: String, default: 0 },
  shippingCharge: { type: Number, default: 0 },
  deliveryMethod: String,
  paymentMethod: String,
  taxAmount: { type: Number, default: 0 },
  deliveryPartnerId: Number,
  transactionId: String,
  deliveryDateTime: { type: Date, default: null },
  orderStatus: String,
  status: { type: Number, default: 1 },
  createdAt: { type: Date, default: null },
  updatedAt: { type: Date, default: null },
});

const OrdersModel = mongoose.model<IOrder>("Orders", orderSchema);

export default OrdersModel;
