import { Router } from 'express';
const routes = Router();
import { addToCart } from '../controller/addCart';
import auth from '../../../middleware/auth';
import { viewCart } from '../controller/viewCart';
import { updateCart } from '../controller/updateCart';
import { clearCart } from '../controller/clearCart';
import { removeItemFromCart } from '../controller/removeCartItem';

routes.get('/viewCart', auth, viewCart);
routes.post('/addToCart', auth, addToCart);
routes.put('/updateCart', auth, updateCart);
routes.delete('/clearCart', auth, clearCart);
routes.delete('/removeItemFromCart', auth, removeItemFromCart);
export default routes;
