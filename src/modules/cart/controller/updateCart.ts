import { Request, Response } from 'express';
import { Cart } from '../../../model/cart';
import { Product, IProduct } from '../../../model/product';
import { BundleProduct, IBundleProduct } from '../../../model/bundle';

export const updateCart = async (req: Request, res: Response) => {
  try {
    const { itemType } = req.query; // Get itemType from query
    const { quantity } = req.body; // Get quantity from body
    const userId = req.userId; // Get userId from request
    const itemId = req.query.itemId as string; // Get itemId from query

    // Validate the input
    if (!itemId || !itemType) {
      return res
        .status(400)
        .json({ message: 'itemId and itemType are required' });
    }

    if (quantity < 1 || isNaN(quantity)) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Initialize item variables
    let item: IProduct | IBundleProduct | null = null;
    let itemPrice = 0;

    // Check if the item exists and retrieve its price
    if (itemType === 'Product') {
      item = (await Product.findById(itemId)) as IProduct;
      itemPrice =
        item?.discountedPrice || item?.sellingPrice || item?.price || 0;
    } else if (itemType === 'Bundle') {
      item = (await BundleProduct.findById(itemId)) as IBundleProduct;
      itemPrice = item?.discountPrice || item?.totalPrice || 0;
    }

    cart.totalAmount = itemPrice * quantity;
    cart.save();
    res.status(202).json({ update: cart });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
