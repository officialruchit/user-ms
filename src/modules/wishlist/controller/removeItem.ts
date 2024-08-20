import { Request, Response } from 'express';
import { Wishlist } from '../../../model/wishlist';
import mongoose from 'mongoose';

// Remove an item from wishlist
export const removeItemFromWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { itemId, itemType } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }

    if (itemType !== 'Product' && itemType !== 'Bundle') {
      return res.status(400).json({ message: 'Invalid item type' });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(
      (item) => !(item.itemId.equals(itemId) && item.itemType === itemType),
    );

    await wishlist.save();

    res
      .status(200)
      .json({ message: `${itemType} removed from wishlist`, wishlist });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
