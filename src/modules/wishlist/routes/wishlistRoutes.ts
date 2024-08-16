import { Router } from 'express';
const routes = Router();
import { getWishlist } from '../controller/getWishlist';
import { removeItemFromWishlist } from '../controller/removeItem';
import { addToWishlist } from '../controller/addedItem';
import auth from '../../../middleware/auth';

routes.get('/getWishlist', auth, getWishlist);
routes.post('/addToWishlist/:id', auth, addToWishlist);
routes.delete('/removeItemFromWishlist', auth, removeItemFromWishlist);
export default routes;
