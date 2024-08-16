import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWishlistItem {
  productId: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface IWishlist extends Document {
  userId: Types.ObjectId;
  items: IWishlistItem[];
}

const WishlistItemSchema = new Schema<IWishlistItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  addedAt: { type: Date, default: Date.now },
});

const WishlistSchema = new Schema<IWishlist>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [WishlistItemSchema],
});

export const Wishlist = mongoose.model<IWishlist>('Wishlist', WishlistSchema);
