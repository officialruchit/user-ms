import { Request, Response } from 'express';
import { Cart } from '../../../model/cart';
import { OrderItem } from '../../../model/orderItem';

export const removeItemFromCart = async (req: Request, res: Response) => {
    try {
        const { itemType, itemId } = req.body;
        const userId = req.userId;

        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(
            (i) => i.itemId.toString() !== itemId || i.itemType !== itemType
        );

        // Update the total amount
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price, 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
