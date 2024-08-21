import { Router } from 'express';
import { getActiveSales } from '../controller/getActiveSales';
import auth from '../../../middleware/auth';
const routes = Router();

routes.get('/getActiveSales',auth, getActiveSales);

export default routes;
