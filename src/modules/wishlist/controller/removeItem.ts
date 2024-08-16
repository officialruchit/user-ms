import { Request, Response } from 'express';
import { Wishlist } from '../../../model/wishlist';

export const removeItemFromWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(
      (item) => !item.productId.toString() === productId,
    );
    await wishlist.save();

    res.status(200).json({ message: 'Item removed from wishlist', wishlist });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
