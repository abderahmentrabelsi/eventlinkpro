// pages/api/users/addUser.ts
import type { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from '../../../configs/mongodb'// Adjust the path as necessary
import User from '../../models/userModel'; // Adjust the path as necessary

// Define the expected request body type
interface RequestBody {
  email: string;
  company: string;
  billing: string;
  country: string;
  contact: number;
  fullName: string;
  username: string;
  role: string;
  currentPlan: string;
}

interface ErrorResponse {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; data?: any } | ErrorResponse>
) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email, company, billing, country, contact, fullName, username, role, currentPlan }: RequestBody = req.body;

    try {
      const user = await User.create({
        email,
        company,
        billing,
        country,
        contact,
        fullName,
        username,
        role,
        currentPlan,
      });
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      console.error('Failed to create user:', error);
      // Handle Mongoose validation errors (if any)
      if (error.name === 'ValidationError') {
        let errors: Record<string, string> = {};
        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });
        return res.status(400).json({ success: false, errors });
      }
      res.status(500).json({ success: false, error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
