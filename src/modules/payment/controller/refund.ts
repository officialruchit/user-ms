import { Request, Response } from 'express';
import { Order } from '../../../model/order';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20', // Specify the API version
});

export const refundOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order is eligible for a refund
    if (order.paymentStatus !== 'completed') {
      return res
        .status(400)
        .json({ message: 'Order is not eligible for a refund' });
    }

    // Process the refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
      amount: order.totalAmount * 100, // Refund the full amount
    });

    // Update the order status
    order.paymentStatus = 'refunded';
    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Refund processed successfully', refund });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
