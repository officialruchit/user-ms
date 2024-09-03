import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Order } from '../../../model/order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

// Middleware to capture raw body for Stripe Webhook

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    // Verify the request and construct the event
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    const error = err as Error;
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const order = await Order.findOne({ paymentIntentId: paymentIntent.id });

      if (order) {
        order.paymentStatus = 'completed';
        order.status = 'processed';
        await order.save();
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const order = await Order.findOne({ paymentIntentId: paymentIntent.id });

      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
      }
      break;
    }
    // Handle other event types here
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};
