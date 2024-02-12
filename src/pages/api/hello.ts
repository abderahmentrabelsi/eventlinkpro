// Import necessary modules or types
import type { NextApiRequest, NextApiResponse } from 'next/types';

// Export the default function handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set the HTTP status to 200
  res.status(200).json({ message: 'Hello from TypeScript API route!' });
}
