import { Request, Response } from 'express';
import { Cart } from '../../../model/cart';
import { OrderItem } from '../../../model/orderItem';
import { Product, IProduct } from '../../../model/product';
import { BundleProduct, IBundleProduct } from '../../../model/bundle';

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { itemType, itemId, quantity } = req.body;
    const userId = req.userId;

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId });
    }

    // Check if the item exists
    let item: IProduct | IBundleProduct | null = null;
    let itemPrice = 0;

    if (itemType === 'Product') {
      item = (await Product.findById(itemId)) as IProduct;
      itemPrice =
        item?.discountedPrice || item?.sellingPrice || item?.price || 0; // Fallback to 0 if no price is found
    } else if (itemType === 'Bundle') {
      item = (await BundleProduct.findById(itemId)) as IBundleProduct;
      itemPrice = item?.discountPrice || item?.totalPrice || 0; // Fallback to 0 if no price is found
    }

    if (!item) {
      return res.status(404).json({ message: `${itemType} not found` });
    }

    // Check if the item is already in the cart
    const existingItemIndex = cart.items.findIndex(
      (i) => i.itemId.toString() === itemId && i.itemType === itemType,
    );

    if (existingItemIndex > -1) {
      // Update the quantity and price if it exists
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price =
        itemPrice * cart.items[existingItemIndex].quantity;
    } else {
      // Add new item to the cart
      const newItem = new OrderItem({
        itemType,
        itemId,
        quantity,
        price: itemPrice * quantity,
      });

      cart.items.push(newItem);
    }

    // Update the total amount
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price, 0);

    // Save the cart and its items
    await cart.save();

    res.status(200).json({ message: `${itemType} added to cart`, cart });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
