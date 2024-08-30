import { Request, Response } from 'express';
import { Order } from '../../../model/order';
import { OrderItem } from '../../../model/orderItem';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20', // Specify the API version
});

export const buyNow = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { itemType, itemId, quantity, paymentMethod, address } = req.body;

    // Validate input
    if (!itemType || !itemId || !quantity || !paymentMethod || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create the OrderItem
    const orderItem = new OrderItem({
      itemType,
      itemId,
      quantity,
      price: req.body.price, // Assume the price is sent in the request
    });
    await orderItem.save();

    // Calculate the total amount
    const totalAmount = orderItem.price * orderItem.quantity;

    // Create the order
    const order = new Order({
      userId,
      orderItems: [orderItem._id],
      totalAmount,
      paymentMethod,
      address,
      paymentStatus: 'pending',
      status: 'pending',
    });
    await order.save();

    // Create a Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe works with cents
      currency: 'usd', // Adjust the currency as needed
      payment_method: paymentMethod,
      confirm: true, // Automatically confirm the payment
      metadata: { orderId: order.id.toString() },
    });

    // Update order with payment intent details
    order.paymentStatus = 'completed';
    order.paymentIntentId = paymentIntent.id;
    order.status = 'processed';
    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
