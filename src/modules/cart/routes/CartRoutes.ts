import { Router } from 'express';
const routes = Router();
import { addToCart } from '../controller/addCart';
import auth from '../../../middleware/auth';
import { getCart } from '../controller/viewCart';
import { updateCart } from '../controller/updateCart';
import { clearCart } from '../controller/clearCart';
import { removeFromCart } from '../controller/removeCartItem';

routes.get('/viewCart', auth, getCart);
routes.post('/addToCart', auth, addToCart);
routes.put('/updateCart', auth, updateCart);
routes.delete('/clearCart', auth, clearCart);
routes.delete('/removeItemFromCart', auth, removeFromCart);
export default routes;
