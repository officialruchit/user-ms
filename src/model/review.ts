import mongoose, { Schema, Document } from 'mongoose';

// Enum for Reviewable Type
export enum ReviewableType {
  Product = 'Product',
  Bundle = 'Bundle',
}

// Interface for the Review
export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  reviewableId: mongoose.Types.ObjectId; // Can be either Product ID or Bundle ID
  reviewableType: ReviewableType; // Specifies if it's a Product or Bundle
  rating: number;
  comment: string;
  images: string[]; // Array of image URLs
  createdAt: Date;
  updatedAt: Date;
}

// Review Schema
const ReviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  reviewableId: { type: Schema.Types.ObjectId, required: true }, // Flexible reference
  reviewableType: {
    type: String,
    enum: Object.values(ReviewableType),
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  images: { type: [String], default: [] }, // Array of image URLs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the Review model
export const Review = mongoose.model<IReview>('Review', ReviewSchema, 'Review');
