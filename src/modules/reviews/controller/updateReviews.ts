import { Request, Response } from 'express';
import { Review } from '../../../model/review';

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment, images } = req.body;
    const userId = req.userId;

    const review = await Review.findOne({ _id: id, userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.images = images || review.images;

    await review.save();

    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
