import { Request, Response } from 'express';
import { Cart } from '../../../model/cart';
import { Order } from '../../../model/order';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { address, paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId }).populate('items');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const newOrder = new Order({
      userId,
      orderItems: cart.items,
      totalAmount: cart.totalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'pending',
      address, // Using the address directly from the request body
    });

    await newOrder.save();

    // Clear the cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({ message: 'Order created', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
};
