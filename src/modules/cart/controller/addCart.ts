import { Request, Response } from 'express';
import { Cart, ICart } from '../../../model/cart';
import { OrderItem, IOrderItem } from '../../../model/orderItem';
import { Product, IProduct } from '../../../model/product';
import mongoose from 'mongoose';

const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    // Check if the product exists
    const product = (await Product.findById(productId)) as IProduct;
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const price = product.price * quantity;

    const orderItem = new OrderItem({
      orderItemId: new mongoose.Types.ObjectId().toString(),
      productId: product.id,
      quantity,
      price,
    }) as IOrderItem;

    // Save the order item
    await orderItem.save();

    // Check if the user already has a cart
    let cart = (await Cart.findOne({ userId })) as ICart;
    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({
        cartId: new mongoose.Types.ObjectId().toString(),
        userId,
        items: [orderItem._id],
        totalAmount: orderItem.price,
      });
    } else {
      // If the cart exists, add the item to the cart
      cart.items.push(orderItem.id);
      cart.totalAmount += orderItem.price;
    }

    // Save the cart
    await cart.save();

    return res.status(200).json({ message: 'Item added to cart', cart });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};

export { addToCart };
