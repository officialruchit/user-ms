import { Request, Response } from "express";
import User from "../../../model/user";
export const getProfil = async (req: Request, res: Response) => {
    try {
        const profile = await User.find();
        if(!profile){
            res.status(401).json({message:"not found"})
        }
        res.status(201).json({ message: profile })
    } catch (error) {
        const err = error as Error
        res.status(501).json({ message: err.message })
    }
}