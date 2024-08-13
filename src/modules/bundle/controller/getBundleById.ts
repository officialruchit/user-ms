import { Request, Response } from 'express';
import { BundleProduct } from '../../../model/bundle';
export const getBundleById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const bundleProducts =
      await BundleProduct.findById(id).populate('products');
    if (!bundleProducts) {
      res.status(401).json({ message: 'not found' });
    }
    res.status(200).json({
      bundleProducts,
    });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ Message: error.message });
  }
};
