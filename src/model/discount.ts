import mongoose, { Document, Schema } from 'mongoose';
export interface IDiscount extends Document {
  sellerId: string;
  percentage: number;
  description?: string;
  validFrom: Date;
  validTo: Date;
  createAt: Date;
  updateAt: Date;
}

const DiscountSchema: Schema<IDiscount> = new Schema({
  sellerId: { type: String, required: true },
  percentage: { type: Number, required: true },
  description: { type: String },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

export const discount = mongoose.model('Discount', DiscountSchema, 'Discount');
