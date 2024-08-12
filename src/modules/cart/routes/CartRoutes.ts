import { Router } from 'express';
const routes = Router();
import { addToCart } from '../controller/addCart';

routes.post('/addToCart', addToCart);

export default routes;
