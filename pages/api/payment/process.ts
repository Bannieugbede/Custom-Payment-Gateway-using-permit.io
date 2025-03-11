import type { NextApiRequest, NextApiResponse } from 'next';
import { Permit } from 'permitio';

// Initialize Permit.io with the correct PDP address
const permit = new Permit({
  token: process.env.PERMIT_API_KEY, // Loaded from .env
  pdp: 'http://localhost:7766', // Local PDP port (update if using a different port, e.g., 7777)
  log: { level: 'debug' }, // Enable debug logs for troubleshooting
  timeout: 5000, // Set a 5-second timeout to avoid hanging
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId, amount, action } = req.body;

  // Validate request body
  if (!userId || !amount || !action) {
    return res.status(400).json({ error: 'Missing required fields (userId, amount, action)' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }

  if (action !== 'pay' && action !== 'refund') {
    return res.status(400).json({ error: 'Invalid action (must be "pay" or "refund")' });
  }

  try {
    console.log(`Checking permission for ${userId} to ${action} on default/payment:*`);
    console.log('Request body:', { userId, amount, action });

    // Check authorization with Permit.io with retry logic
    let allowed: boolean;
    try {
      allowed = await permit.check(userId, action, 'default/payment:*');
    } catch (checkError: any) {
      console.error('Initial permit.check failed:', {
        message: checkError.message,
        name: checkError.name,
        stack: checkError.stack,
        code: checkError.code,
      });
      throw checkError; // Re-throw to handle in the outer catch
    }

    console.log(`Permission check result: ${allowed}`);
    if (!allowed) {
      return res.status(403).json({ error: 'Unauthorized action' });
    }

    // Mock payment gateway logic
    if (action === 'pay') {
      const transactionId = `txn_${Math.random().toString(36).substring(2, 9)}`;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return res.status(200).json({
        success: true,
        transactionId,
        amount,
        message: `Payment of $${amount} processed successfully`,
      });
    } else if (action === 'refund') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return res.status(200).json({
        success: true,
        message: `Refund of $${amount} processed successfully`,
      });
    }
  } catch (error: any) {
    console.error('Permit check or processing error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
    });
    return res.status(500).json({
      error: 'Internal Server Error',
      details: {
        message: error.message,
        name: error.name,
        stack: error.stack,
        code: error.code,
      },
    });
  }
}