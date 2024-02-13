// pages/api/users/signup.ts
import type { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from '../../../configs/mongodb'; // Adjust the path as necessary
import User from '../../models/userModel'; // Adjust the path as necessary
import bcrypt from 'bcrypt';

interface RequestBody {
  email: string;
  username: string;
  password: string;
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
    const { email, username, password }: RequestBody = req.body;

    // Simple validation
    if (!email || !username || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email, username, and password.' });
    }

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'User already exists with that email or username.' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await User.create({
        email,
        username,
        password: hashedPassword,
        // Set default or optional fields if necessary
        company: 'Default Company',
        billing: 'Default Billing',
        country: 'Default Country',
        contact: 0, // Consider how you want to handle default values
        fullName: 'Default Name',
        role: 'user', // Default role
        currentPlan: 'Default Plan',
      });

      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      console.error('Failed to register user:', error);
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
