import express from 'express';
import { createOrder } from '../controller/createOrder';
import { getOrderById } from '../controller/getOrderById';
import { getAllOrders } from '../controller/getAllOrder';
import { deleteOrder } from '../controller/deleteOrder';

const router = express.Router();

// POST /order
router.post('/order', createOrder);
router.get('/order/:id', getOrderById);
router.get('/orders', getAllOrders);
router.get('/orders/:id', deleteOrder);
export default router;
