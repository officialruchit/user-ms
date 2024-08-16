import { Router } from 'express';
const routes = Router();
import { getProfil } from '../controller/userProfile';
import auth from '../../../middleware/auth';

routes.get('/getProfil', auth, getProfil);

export default routes;
