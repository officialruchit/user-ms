import { Request, Response } from 'express';
import { Sales } from '../../../model/sales';
import { isBefore, isAfter } from 'date-fns';

export const getActiveSales = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const currentDate = new Date();

    // Convert query parameters to integers
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Find all sales
    const sales = await Sales.find()
      .populate('items.itemId')
      .skip(skip)
      .limit(limitNumber);

    // Filter sales based on the current date
    const activeSales = sales.filter(
      (sale) =>
        isBefore(new Date(sale.validFrom), currentDate) &&
        isAfter(new Date(sale.validTo), currentDate),
    );

    // Get total count of active sales
    const totalSales = activeSales.length;

    return res.status(200).json({
      sales: activeSales,
      pagination: {
        totalItems: totalSales,
        totalPages: Math.ceil(totalSales / limitNumber),
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
