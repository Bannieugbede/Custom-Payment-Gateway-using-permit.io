import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { Permit } from 'permitio';

const permit = new Permit({
  pdp: 'http://localhost:7766',
  token: process.env.PERMIT_API_KEY,
});

export function checkPermission(action: string, resource: string) {
  return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    const userId = req.body.userId || req.query.userId; // Extract userId from request

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    try {
      const allowed = await permit.check(userId, action, resource);
      if (!allowed) {
        return res.status(403).json({ error: 'Unauthorized action' });
      }
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ error: 'Internal Server Error', details: error });
    }
  };
}