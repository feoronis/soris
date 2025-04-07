import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { maxCounter } = req.body;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { maxCounter }
      });

      return res.status(200).json({ message: 'Settings updated' });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating settings' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}