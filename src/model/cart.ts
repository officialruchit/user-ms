import mongoose, { Schema, Document } from 'mongoose';
import { IOrderItem } from './orderItem';

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Schema
const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  items: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }],
  totalAmount: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Cart = mongoose.model<ICart>('Cart', CartSchema, 'Cart');
