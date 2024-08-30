import express from 'express';
import db from './config/db';
import Routes from './routes/userRoutes'; // Adjust the path according to your project structure
import bodyParser from 'body-parser';
import Stripe from 'stripe'; // Import Stripe

const app = express();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20', // Specify the API version you're using
});

// Middleware to parse JSON requests
app.use(bodyParser.json()); // Ensure bodyParser is used before any routes

// Connect to the database
db();

// Use routes for user-related operations
app.use('/user', Routes);

// Payment route to create a payment intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    // Destructure amount and currency from the request body
    const { amount, currency } = req.body;

    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in the smallest currency unit (e.g., cents for USD)
      currency: currency, // The currency (e.g., 'usd')
      automatic_payment_methods: { enabled: true }, // Automatically enable payment methods based on the currency and country
    });

    // Send the client secret to the frontend
    res.send({
      clientSecret: paymentIntent.client_secret, // The client secret will be used by Stripe.js on the frontend
    });
  } catch (error) {
    // Handle any errors
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
