import { Request, Response } from 'express';
import { Cart } from '../../../model/cart';

export const viewCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate({
      path: 'items',
      populate: { path: 'productId', model: 'Product' },
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json({ cart });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
};
