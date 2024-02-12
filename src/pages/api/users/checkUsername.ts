// pages/api/users/checkUsername.ts
import type { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from '../../../configs/mongodb'; // Adjust the path as necessary
import User from '../../models/userModel'; // Adjust the path as necessary

interface ErrorResponse {
  success: boolean;
  exists?: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; exists: boolean } | ErrorResponse>
) {
  await dbConnect();

  if (req.method === 'POST') {
    const { username }: { username: string } = req.body;

    try {
      const userExists = await User.findOne({ username: username });
      if (userExists) {
        return res.status(200).json({ success: true, exists: true });
      } else {
        return res.status(200).json({ success: true, exists: false });
      }
    } catch (error) {
      console.error('Failed to check username:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
