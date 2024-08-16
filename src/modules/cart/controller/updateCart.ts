import { Request, Response } from 'express';
import { Cart, ICart } from '../../../model/cart';
import { IOrderItem, OrderItem } from '../../../model/orderItem';

export const updateCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    const cart = (await Cart.findOne({ userId }).populate('items')) as ICart;
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the index of the item in the cart
    const itemIndex = cart.items.findIndex(
      (item: IOrderItem) => item.productId.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const orderItem = cart.items[itemIndex];
    orderItem.quantity = quantity;
    orderItem.price = (orderItem.price / orderItem.quantity) * quantity; // Recalculate price

    await orderItem.save();

    // Update totalAmount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price,
      0,
    );
    await cart.save();

    return res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
