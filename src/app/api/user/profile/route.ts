// pages/api/user/profile.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // sesuaikan path prisma client kamu
import { getSession } from '@/lib/auth'; // misal pakai session auth middleware

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const userId = session.user.id;

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      // field lain sesuai model
    });
  }

  if (req.method === 'PUT') {
    const { name, email } = req.body;
    // validasi sederhana bisa ditambah

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name, email },
      });
      return res.json({ message: 'Profile updated', user: updatedUser });
    } catch (error) {
      return res.status(500).json({ message: 'Update failed' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
