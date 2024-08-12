import { Router } from 'express';
const routes = Router();
import {getAllProducts} from '../controller/getAllProduct'
import { getAllProductsById } from '../controller/getProductById';

routes.get('/getAllProducts', getAllProducts);
routes.get('/getAllProductsById/:id', getAllProductsById);

export default routes;
