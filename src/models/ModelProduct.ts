import mongoose, { Schema, Document } from "mongoose";

interface Product extends Document {
  name: string;
  categories: Array<mongoose.Types.ObjectId>;
  brands: Array<mongoose.Types.ObjectId>;
  hsn: string;
  barcode: string;
  tax: number;
  description: string;
  cover_file: string;
  unit: string;
  sku: string;
  incrementC: number;
  weight: number;
  min_quantity: number;
  max_quantity: number;
  files: Array<string>;
  discount: number;
  purchase_price: number;
  mrp: number;
  sale_price: number;
  expired: Date;
  stock: number;
  status: number;
}
const productSchema: Schema<Product> = new Schema({
  name: { type: String, maxlength: 40 },
  categories: [{ type: Schema.Types.ObjectId, ref: "Categories" }],
  brands: [{ type: Schema.Types.ObjectId, ref: "Brands" }],
  hsn: { type: String, maxlength: 30 },
  barcode: { type: String, maxlength: 40 },
  tax: { type: Number },
  description: { type: String },
  cover_file: { type: String, maxlength: 100 },
  unit: { type: String, maxlength: 10 },
  sku: { type: String, maxlength: 30 },
  incrementC: { type: Number },
  weight: { type: Number },
  min_quantity: { type: Number },
  max_quantity: { type: Number },
  files: [{ type: String }],
  discount: { type: Number },
  purchase_price: { type: Number },
  mrp: { type: Number },
  sale_price: { type: Number },
  expired: { type: Date },
  stock: { type: Number },
  status: { type: Number },
});

const ProductModel = mongoose.model<Product>("Product", productSchema);
export default ProductModel;
