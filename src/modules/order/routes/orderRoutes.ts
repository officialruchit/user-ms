import express from 'express';
import { createOrder } from '../controller/createOrder';
import { getOrderById } from '../controller/getOrderById';
import { getAllOrders } from '../controller/getAllOrder';
import { deleteOrder } from '../controller/deleteOrder';
import auth from '../../../middleware/auth';
import { handlePayment } from '../controller/handlePayment';
import { stripeWebhook } from '../controller/stripeWebhooks';

const router = express.Router();

// POST /order
router.post('/order', auth, createOrder);
router.get('/order/:id', auth, getOrderById);
router.get('/orders', auth, getAllOrders);
router.post('/handlePayment', auth, handlePayment);
router.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook,
);
router.delete('/order/:id', auth, deleteOrder);
export default router;
