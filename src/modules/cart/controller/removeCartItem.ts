import { Request, Response } from 'express';
import { Cart, ICart } from '../../../model/cart';
import { OrderItem } from '../../../model/orderItem';
import mongoose from 'mongoose';

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.body; // itemId is the _id of the specific item in the cart
    const userId = req.userId;
    console.log(itemId);
    const cart = (await Cart.findOne({ userId }).populate('items')) as ICart;
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const filteredItems = cart.items.filter(
      (item) => item.id.toString() === itemId,
    );

    if (filteredItems.length > 0) {
      const extractedId = filteredItems[0]._id;
      const itemPrice = filteredItems[0].price; // Extract the _id from the first item in the filtered array
      console.log(extractedId); // Logs the extracted _id

      await OrderItem.findByIdAndDelete(extractedId); // Delete the item using the extracted _id

      const itemIndex = cart.items.findIndex(
        (item) => item.id.toString() === itemId,
      );
      const [removedItem] = cart.items.splice(itemIndex, 1); // Remove the item from the cart

      cart.totalAmount -= itemPrice;
      await cart.save(); // Save the updated cart
      return res.status(200).json({ message: 'Item removed from cart', cart });
    } else {
      console.log('Item not found');
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    return res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    const err = error as Error;
    console.error('Error removing cart item:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
