import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, match: /^[0-9]{10}$/ },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin", "user"] },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});



export default mongoose.model<UserDocument>("User", UserSchema);
