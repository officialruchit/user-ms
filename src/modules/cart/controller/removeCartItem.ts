import { Request, Response } from 'express';
import { Cart, ICart } from '../../../model/cart';
import { OrderItem } from '../../../model/orderItem';

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.body;

    const cart = (await Cart.findOne({ userId })) as ICart;
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const [removedItem] = cart.items.splice(itemIndex, 1);
    await OrderItem.findByIdAndDelete(removedItem);

    cart.totalAmount = cart.items.reduce(async (total, itemId) => {
      const item = await OrderItem.findById(itemId);
      return total + (item ? item.price : 0);
    }, 0);

    await cart.save();

    return res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Error removing cart item:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
