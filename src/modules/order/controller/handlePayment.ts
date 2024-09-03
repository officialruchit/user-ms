import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Order } from '../../../model/order';
import dotenv from 'dotenv';
dotenv.config();
// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export const handlePayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalAmount * 100, // Amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
};
