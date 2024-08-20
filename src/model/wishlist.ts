import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWishlistItem {
  itemId: mongoose.Types.ObjectId; // Can be either a productId or a bundleId
  itemType: 'Product' | 'Bundle'; // Indicates whether the item is a product or a bundle
  addedAt: Date;
}

export interface IWishlist extends Document {
  userId: Types.ObjectId;
  items: IWishlistItem[];
}

const WishlistItemSchema = new Schema<IWishlistItem>({
  itemId: { type: Schema.Types.ObjectId, required: true }, // References either Product or Bundle
  itemType: { type: String, enum: ['Product', 'Bundle'], required: true },
  addedAt: { type: Date, default: Date.now },
});

const WishlistSchema = new Schema<IWishlist>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [WishlistItemSchema],
});

export const Wishlist = mongoose.model<IWishlist>('Wishlist', WishlistSchema);
