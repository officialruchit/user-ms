import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem extends Document {
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

// OrderItem Schema
const OrderItemSchema = new Schema({
  productId: { type: String, required: true, ref: 'Product' },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const OrderItem = mongoose.model<IOrderItem>(
  'OrderItem',
  OrderItemSchema,
  'OrderItem',
);
