import { Request, Response } from 'express';
import { Cart } from '../../../model/cart';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId }).populate({
      path: 'items',
      populate: {
        path: 'itemId', // Populate itemId with details from either Product or BundleProduct
        model: 'Product', // First populate as Product
      },
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
};
