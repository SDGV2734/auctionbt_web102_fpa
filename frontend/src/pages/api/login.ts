// src/pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Handle login logic here
  res.status(200).json({ message: 'User logged in successfully' });
};
