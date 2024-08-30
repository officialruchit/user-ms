import { Request, Response } from 'express';
import { Wishlist } from '../../../model/wishlist';
import mongoose from 'mongoose';

// Add a product to wishlist
export const addProductToWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // Assuming userId is available in the request
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    if (
      wishlist.items.some(
        (item) => item.itemId.equals(productId) && item.itemType === 'Product',
      )
    ) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    wishlist.items.push({
      itemId: productId,
      itemType: 'Product',
      addedAt: new Date(),
    });
    await wishlist.save();

    res.status(200).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
