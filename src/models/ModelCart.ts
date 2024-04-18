import mongoose, { Schema, Document } from "mongoose";

interface ICart extends Document {
  productName: string;
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  file?: string;
  quantity: number;
  discount?: number;
  sale_price: number;
  status?: number;
}

const cartSchema: Schema = new Schema({
  productName: {
    type: String,
    required: true,
    maxlength: 40,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  file: String,
  quantity: {
    type: Number,
    required: true,
  },
  discount: Number,
  sale_price: {
    type: Number,
    required: true,
  },
  status: Number,
});

const CartModel = mongoose.model<ICart>("Cart", cartSchema);

export default CartModel;
