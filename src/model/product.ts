import mongoose, { Document, Schema } from 'mongoose';
import {IDiscount}from './discount'

interface IProduct extends Document {
  sellerId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount?: IDiscount['_id'];
  discountedPrice?: number;
  blocked?: boolean;
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema({
  sellerId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  discount: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },
  discountedPrice: { type: Number },
  blocked: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model<IProduct>('Product', ProductSchema, 'Product');

export { IProduct, Product };
