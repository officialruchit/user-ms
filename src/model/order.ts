import mongoose, { Schema, Document } from 'mongoose';
import { IOrderItem } from './orderItem';

export interface IOrder extends Document {
    orderId: string;
    userId: string;
    orderItems: IOrderItem[];
    totalAmount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

// Order Schema
const OrderSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, ref: 'User' },
  orderItems: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema, 'Order');
