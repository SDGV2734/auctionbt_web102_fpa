// src/pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Handle add product logic here
    res.status(201).json({ message: 'Product added successfully' });
  } else if (req.method === 'GET') {
    // Handle get products logic here
    res.status(200).json({ data: [] });
  }
};
