import { Request, Response } from "express";
import { Cart } from "../../../model/cart";
import { OrderItem } from "../../../model/orderItem";

export const clearCart = async (req: Request, res: Response) => {
    try {
 const userId= req.userId
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        await OrderItem.deleteMany({ _id: { $in: cart.items } });

        cart.items = [];
        cart.totalAmount = 0;

        await cart.save();

        return res.status(200).json({ message: "Cart cleared", cart });
    } catch (error) {
        const err=error as Error
        return res.status(500).json({ message: err.message });
    }
};
