import { Request, Response } from 'express';
import { Order } from '../../../model/order';

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find and delete the order
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
