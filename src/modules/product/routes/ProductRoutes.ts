import { Router } from 'express';
const routes = Router();
import { getAllProducts } from '../controller/getAllProduct';
import { getAllProductsById } from '../controller/getProductById';
import auth from '../../../middleware/auth';

routes.get('/getAllProducts', auth, getAllProducts);
routes.get('/getAllProductsById/:id', getAllProductsById);

export default routes;
