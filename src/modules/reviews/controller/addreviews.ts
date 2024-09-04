import { Request, Response } from 'express';
import { Review, ReviewableType } from '../../../model/review';

export const addReview = async (req: Request, res: Response) => {
  try {
    const { reviewableId, reviewableType, rating, comment, images } = req.body;
    const userId = req.userId;

    if (
      ![ReviewableType.Product, ReviewableType.Bundle].includes(reviewableType)
    ) {
      return res.status(400).json({ message: 'Invalid reviewable type' });
    }

    const review = new Review({
      userId,
      reviewableId,
      reviewableType,
      rating,
      comment,
      images,
    });

    await review.save();
    res.status(201).json({ message: 'Review added successfully', review });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
