import { Request, Response } from 'express';
import { Wishlist } from '../../../model/wishlist';
import mongoose from 'mongoose';

// Add a bundle to wishlist
export const addBundleToWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { bundleId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bundleId)) {
      return res.status(400).json({ message: 'Invalid bundle ID' });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    if (
      wishlist.items.some(
        (item) => item.itemId.equals(bundleId) && item.itemType === 'Bundle',
      )
    ) {
      return res.status(400).json({ message: 'Bundle already in wishlist' });
    }

    wishlist.items.push({
      itemId: bundleId,
      itemType: 'Bundle',
      addedAt: new Date(),
    });
    await wishlist.save();

    res.status(200).json({ message: 'Bundle added to wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
