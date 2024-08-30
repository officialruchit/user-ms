import express from 'express';
import { buyNow } from '../controller/buyNow';
import { refundOrder } from '../controller/refund';

const router = express.Router();

// POST /buy-now
router.post('/buy-now', buyNow);
// POST /order/:id/refund
router.post('/order/:id/refund', refundOrder);

export default router;
