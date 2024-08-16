import { Request, Response } from 'express';
import { Wishlist, IWishlistItem } from '../../../model/wishlist';
import mongoose from 'mongoose';

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // Assuming userId is populated via middleware
    const productId = req.params.productId;

    // Validate productId
    //  if (!mongoose.Types.ObjectId.isValid(productId)) {
    //      return res.status(400).json({ message: 'Invalid product ID' });
    // }

    // Find the user's wishlist
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // If the wishlist doesn't exist, create a new one
      wishlist = new Wishlist({ userId, items: [] });
    }

    // Check if the product is already in the wishlist
    const productExists = wishlist.items.some(
      (item) => item.productId.toString() === productId,
    );

    if (productExists) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add the product to the wishlist
    const newWishlistItem: IWishlistItem = {
      productId: new mongoose.Types.ObjectId(productId),
      addedAt: new Date(),
    };

    wishlist.items.push(newWishlistItem);
    await wishlist.save();

    return res
      .status(200)
      .json({ message: 'Product added to wishlist', wishlist });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
