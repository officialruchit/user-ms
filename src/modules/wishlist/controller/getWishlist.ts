import { Request, Response } from 'express';
import { Wishlist } from '../../../model/wishlist';

// Get all items in the wishlist
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const wishlist = await Wishlist.findOne({ userId }).populate(
      'items.itemId',
    ); // Populate both products and bundles

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
