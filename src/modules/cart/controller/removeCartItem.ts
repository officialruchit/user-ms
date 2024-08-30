import { Request, Response } from 'express';
import { Cart } from '../../../model/cart';

export const removeItemFromCart = async (req: Request, res: Response) => {
  try {
    const { itemType, itemId } = req.body;
    const userId = req.userId;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter((i) => {
      // Ensure that itemId and itemType are defined before comparing
      if (!i.itemId || !i.itemType) {
        return true; // Keep the item if either is undefined
      }
      return i.itemId.toString() !== itemId || i.itemType !== itemType;
    });

    // Update the total amount, ensuring that the price is a valid number
    cart.totalAmount = cart.items.reduce((sum, item) => {
      const price = item.price || 0; // Fallback to 0 if price is undefined or null
      return sum + price;
    }, 0);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
