import { Router } from 'express';
import { addReview } from '../controller/addreviews';
import { getReviewsByReviewableId } from '../controller/getReviewById';
import { updateReview } from '../controller/updateReviews';
import { deleteReview } from '../controller/deleteReview';
import auth from '../../../middleware/auth';

const router = Router();

router.post('/reviews', auth, addReview);
router.get('/reviews/:reviewableId', auth, getReviewsByReviewableId);
router.put('/reviews/:id', auth, updateReview);
router.delete('/reviews/:id', auth, deleteReview);

export default router;
