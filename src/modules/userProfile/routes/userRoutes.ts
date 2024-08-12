import { Router } from 'express';
const routes = Router();
import {getProfil} from '../controller/userProfile'

routes.get('/getProfil', getProfil);

export default routes;
