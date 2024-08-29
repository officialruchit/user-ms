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
            item = await Product.findById(itemId) as IProduct;
            itemPrice = item?.discountedPrice || item?.sellingPrice; // Use discountedPrice if available, else use sellingPrice
        } else if (itemType === 'Bundle') {
            item = await BundleProduct.findById(itemId) as IBundleProduct;
            itemPrice = item?.discountPrice || item?.totalPrice || 0; // Use discountPrice if available, else use totalPrice
        }

        if (!item) {
            return res.status(404).json({ message: `${itemType} not found` });
        }

        // Check if the item is already in the cart
        const existingItem = cart.items.find(
            (i) => i.itemId.toString() === itemId && i.itemType === itemType
        );

        if (existingItem) {
            // Update the quantity and price if it exists
            existingItem.quantity += quantity;
            existingItem.price = itemPrice * existingItem.quantity;
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

        // Save the cart
        await cart.save();

        res.status(200).json({ message: `${itemType} added to cart`, cart });
    } catch (err) {
      const error = err as Error;
      return res.status(500).json({ message: error.message });
    }
};
