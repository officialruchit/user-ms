import { Request, Response } from 'express';
import { Cart } from '../../../model/cart';

export const viewCart = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.itemId',
            select: 'name price', // Select fields to populate
            populate: { path: 'itemType', select: 'name' }, // Populate based on itemType
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (err) {
      const error = err as Error;
      return res.status(500).json({ message: error.message });
    }
};
