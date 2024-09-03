import { Request, Response } from 'express';
import { Cart } from '../../../model/cart';
import { OrderItem } from '../../../model/orderItem';
import { Product, IProduct } from '../../../model/product';
import { BundleProduct, IBundleProduct } from '../../../model/bundle';

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { itemId, itemType } = req.query;
    const { quantity } = req.body;
    const userId = req.userId;

    if (!itemId || !itemType) {
      return res
        .status(400)
        .json({ message: 'itemId and itemType are required' });
    }

    if (quantity < 1 || isNaN(quantity)) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    let itemPrice = 0;
    let item: IProduct | IBundleProduct | null = null;

    if (itemType === 'Product') {
      item = (await Product.findById(itemId)) as IProduct;
      itemPrice =
        item?.discountedPrice || item?.sellingPrice || item?.price || 0;
    } else if (itemType === 'Bundle') {
      item = (await BundleProduct.findById(itemId)) as IBundleProduct;
      itemPrice = item?.discountPrice || item?.totalPrice || 0;
    }

    if (!item) {
      return res.status(404).json({ message: `${itemType} not found` });
    }

    let cart = await Cart.findOne({ userId }).populate('items');
    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    const existingItemIndex = cart.items.findIndex(
      (i: any) => i.itemId.toString() === itemId && i.itemType === itemType,
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price =
        itemPrice * cart.items[existingItemIndex].quantity;
    } else {
      const newItem = new OrderItem({
        itemType,
        itemId,
        quantity,
        price: itemPrice * quantity,
      });

      await newItem.save(); // Save the new order item

      cart.items.push(newItem);
    }

    cart.totalAmount = cart.items.reduce(
      (sum: number, item: any) => sum + item.price,
      0,
    );
    await cart.save();

    res.status(200).json({ message: `${itemType} added to cart`, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
};
