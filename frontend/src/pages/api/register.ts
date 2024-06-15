// src/pages/api/register.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Handle registration logic here
  res.status(200).json({ message: 'User registered successfully' });
};
