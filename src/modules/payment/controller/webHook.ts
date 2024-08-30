import { Request, Response } from 'express';
import { Order } from '../../../model/order';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20', // Specify the API version
});

export const getRefundStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Retrieve the refund status from Stripe
    const refund = await stripe.refunds.list({
      payment_intent: order.paymentIntentId,
    });

    res.status(200).json({ refund });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
