import { Request, Response } from 'express';
import { Cart } from '../../../model/cart';
import { OrderItem } from '../../../model/orderItem';
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { itemId, itemType } = req.query;
    const userId = req.userId;

    const cart = await Cart.findOne({ userId }).populate('items');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (i: any) => i.itemId.toString() === itemId && i.itemType === itemType,
    );

    if (itemIndex > -1) {
      const [removedItem] = cart.items.splice(itemIndex, 1);
      await OrderItem.findByIdAndDelete(removedItem._id); // Remove the order item from the database
      cart.totalAmount = cart.items.reduce(
        (sum: number, item: any) => sum + item.price,
        0,
      );
      await cart.save();
    }

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
};
