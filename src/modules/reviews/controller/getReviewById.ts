import { Request, Response } from 'express';
import { Review } from '../../../model/review';

export const getReviewsByReviewableId = async (req: Request, res: Response) => {
  try {
    const { reviewableId } = req.params;
    const reviews = await Review.find({ reviewableId }).populate(
      'userId',
      'username',
    );

    res.status(200).json(reviews);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
