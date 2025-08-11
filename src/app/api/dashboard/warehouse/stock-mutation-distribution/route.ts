import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfMonth } from 'date-fns';

export async function GET() {
  const start = startOfMonth(new Date());

  const [inData, outData] = await Promise.all([
    prisma.stockMutation.aggregate({
      _sum: { quantity: true },
      where: { type: 'IN', createdAt: { gte: start } },
    }),
    prisma.stockMutation.aggregate({
      _sum: { quantity: true },
      where: { type: 'OUT', createdAt: { gte: start } },
    }),
  ]);

  return NextResponse.json([
    { type: 'IN', quantity: inData._sum.quantity || 0 },
    { type: 'OUT', quantity: outData._sum.quantity || 0 },
  ]);
}
