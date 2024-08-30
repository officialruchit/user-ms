import { Request, Response } from 'express';
import { Cart } from '../../../model/cart';

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear all items from the cart
    cart.items = [];
    cart.totalAmount = 0;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
