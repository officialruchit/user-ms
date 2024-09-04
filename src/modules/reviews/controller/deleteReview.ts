import { Request, Response } from 'express';
import { Review } from '../../../model/review';

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const review = await Review.findOneAndDelete({ _id: id, userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
