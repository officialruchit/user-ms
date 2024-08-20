import { Request, Response } from 'express';
import { Wishlist } from '../../../model/wishlist';
import mongoose from 'mongoose';

// Get wishlist item by item ID
export const getWishlistItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }

    // Find the wishlist by userId
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Find the specific item in the wishlist by its _id
    const item = wishlist.items.find((item) => item.itemId.toString() === id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
