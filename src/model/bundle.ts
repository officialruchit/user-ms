import mongoose, { Document, Schema } from 'mongoose';

// BundleProduct Interface
interface IBundleProduct extends Document {
  sellerId: string;
  name: string;
  description?: string;
  products: mongoose.Types.ObjectId[];
  discount?: number;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Bundle Product Schema
const BundleProductSchema = new Schema<IBundleProduct>({
  sellerId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  discount: { type: Number, default: 0 },
  blocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BundleProduct = mongoose.model<Document>(
  'BundleProduct',
  BundleProductSchema,
  'BundleProduct',
);
export { BundleProduct, IBundleProduct };
