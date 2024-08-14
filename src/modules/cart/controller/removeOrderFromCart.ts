import { Request, Response } from "express";
import { Cart,ICart } from "../../../model/cart";
import { OrderItem } from "../../../model/orderItem";

const removeProductFromCart = async (cartId, orderItemId) => {
    try {
        // Find the cart by ID
        const cart = await Cart.findById(cartId).populate('items');
        if (!cart) {
            return { success: false, message: 'Cart not found' };
        }

        // Find the index of the order item to be removed
        const itemIndex = cart.items.findIndex(item => item._id.toString() === orderItemId);
        if (itemIndex === -1) {
            return { success: false, message: 'Item not found in cart' };
        }

        // Update the total amount
        const itemToRemove = cart.items[itemIndex];
        cart.totalAmount -= itemToRemove.price * itemToRemove.quantity;

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);

        // Save the updated cart
        await cart.save();

        return { success: true, message: 'Item removed successfully', cart };
    } catch (error) {
        return { success: false, message: 'Error removing item', error };
    }
};
