import { Request, Response } from 'express';
import { Wishlist } from '../../../model/wishlist';

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json({ wishlist });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
