import { Router } from 'express';
const routes = Router();
import { getWishlist } from '../controller/getWishlist';
import { addProductToWishlist } from '../controller/addedItem';
import auth from '../../../middleware/auth';
import { addBundleToWishlist } from '../controller/addBundleToWishlist';
import { removeItemFromWishlist } from '../controller/removeItem';
import { getWishlistItemById } from '../controller/getWishListById';

routes.get('/getWishlist', auth, getWishlist);
routes.get('/getWishlistById/:id', auth, getWishlistItemById);
routes.post('/addProductToWishlist/:id', auth, addProductToWishlist);
routes.post('/addBundleToWishlist', auth, addBundleToWishlist);
routes.delete('/wishlist/:itemId/:itemType', auth, removeItemFromWishlist);
export default routes;
