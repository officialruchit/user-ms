import mongoose, { Document, Schema } from 'mongoose';

interface IProduct extends Document {
  sellerId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount: mongoose.Types.ObjectId;
  discountedPrice: number;
  blocked: boolean;
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Product Schema
const ProductSchema: Schema<IProduct> = new Schema({
  sellerId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  discount: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },
  discountedPrice: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model<Document>('Product', ProductSchema, 'Product');

export { IProduct, Product };
