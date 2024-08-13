import { Router } from 'express';
const routes = Router();
import { getAllBundle } from '../controller/getAllBundle';
import { getBundleById } from '../controller/getBundleById';

routes.get('/getAllBundle', getAllBundle);
routes.get('/getBundleById/:id', getBundleById);

export default routes;
