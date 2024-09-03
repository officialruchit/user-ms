import { Request, Response } from 'express';
import { Order } from '../../../model/order';

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the order by ID
    const order = await Order.findById(id).populate('orderItems');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
