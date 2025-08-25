import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '5');
  const period = searchParams.get('period') || 'this_month';
  const startParam = searchParams.get('startDate');
  const endParam = searchParams.get('endDate');

  let startDate: Date;
  let endDate: Date;

  if (startParam && endParam) {
    // jika custom date range dipilih
    startDate = startOfDay(parseISO(startParam));
    endDate = endOfDay(parseISO(endParam));
  } else {
    // default period
    const now = new Date();
    switch (period) {
      case 'today':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case 'last_7_days':
        startDate = startOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));
        endDate = endOfDay(now);
        break;
      case 'last_month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        startDate = startOfDay(lastMonth);
        endDate = endOfDay(new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0));
        break;
      case 'this_year':
        startDate = startOfDay(new Date(now.getFullYear(), 0, 1));
        endDate = endOfDay(new Date(now.getFullYear(), 11, 31));
        break;
      default:
        startDate = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
        endDate = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
        break;
    }
  }

  const recentMutations = await prisma.stockMutation.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    where: { createdAt: { gte: startDate, lte: endDate } },
    select: {
      id: true,
      quantity: true,
      type: true,
      createdAt: true,
      rawMaterial: { select: { name: true } },
      createdBy: { select: { name: true } },
    },
  });

  return NextResponse.json({
    recentMutations: recentMutations.map((m) => ({
      id: m.id,
      material: m.rawMaterial?.name || '-',
      quantity: m.quantity,
      type: m.type,
      createdBy: m.createdBy?.name || '-',
      createdAt: m.createdAt,
    })),
  });
}
