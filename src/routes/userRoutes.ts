import express from 'express';
const router = express.Router();
import profile from '../modules/userProfile/routes/userRoutes';
import bundle from '../modules/bundle/routes/BundleRoutes';
import product from '../modules/product/routes/ProductRoutes';
import cart from '../modules/cart/routes/CartRoutes';
import routes from '../modules/wishlist/routes/wishlistRoutes';

router.use('/', profile);
router.use('/', bundle);
router.use('/', product);
router.use('/', cart);
router.use('/', routes);

export default router;
