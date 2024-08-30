import { Request, Response } from 'express';
import { Cart } from '../../../model/cart';
import { Order } from '../../../model/order';
import { OrderItem } from '../../../model/orderItem';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate('items.itemId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    // Create order items from the cart items
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const orderItem = new OrderItem({
          itemType: item.itemType,
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.price,
        });
        await orderItem.save();
        return orderItem.id;
      }),
    );

    // Create the order
    const order = new Order({
      userId,
      orderItems,
      totalAmount: cart.totalAmount,
      paymentMethod: req.body.paymentMethod, // Ensure this is provided in the request
      address: req.body.address, // Ensure this is provided in the request
      paymentStatus: 'pending',
      status: 'pending',
    });

    // Save the order
    await order.save();

    // Clear the cart after creating the order
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
