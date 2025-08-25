import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
} from 'date-fns';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'this_month';
  const limit = parseInt(searchParams.get('limit') || '5');

  let startDate: Date = new Date(); // default supaya TypeScript yakin
  let endDate: Date = new Date();
  let interval: Date[] = [];

  switch (period) {
    case 'today':
      startDate = startOfDay(new Date());
      endDate = endOfDay(new Date());
      interval = [new Date()];
      break;
    case 'last_7_days':
      startDate = startOfDay(subDays(new Date(), 6));
      endDate = endOfDay(new Date());
      interval = eachDayOfInterval({ start: startDate, end: endDate });
      break;
    case 'this_month':
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
      interval = eachDayOfInterval({ start: startDate, end: endDate });
      break;
    case 'last_month':
      const lastMonthDate = subDays(startOfMonth(new Date()), 1);
      startDate = startOfMonth(lastMonthDate);
      endDate = endOfMonth(lastMonthDate);
      interval = eachDayOfInterval({ start: startDate, end: endDate });
      break;
    case 'this_year':
      startDate = startOfYear(new Date());
      endDate = endOfYear(new Date());
      interval = eachMonthOfInterval({ start: startDate, end: endDate });
      break;
    default:
      // fallback
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
      interval = eachDayOfInterval({ start: startDate, end: endDate });
  }

  // Summary counts
  const totalPurchaseRequests = await prisma.purchaseRequest.count({
    where: { createdAt: { gte: startDate, lte: endDate } },
  });
  const totalPurchaseOrders = await prisma.purchaseOrder.count({
    where: { createdAt: { gte: startDate, lte: endDate } },
  });
  const totalRawMaterials = await prisma.rawMaterial.count();
  const totalStockMutationsIn = await prisma.stockMutation.count({
    where: { type: 'IN', createdAt: { gte: startDate, lte: endDate } },
  });
  const totalStockMutationsOut = await prisma.stockMutation.count({
    where: { type: 'OUT', createdAt: { gte: startDate, lte: endDate } },
  });

  // Chart data
  const chartData = await Promise.all(
    interval.map(async (date) => {
      let prCount = 0;
      let poCount = 0;
      let inCount = 0;
      let outCount = 0;

      if (period === 'this_year') {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);

        prCount = await prisma.purchaseRequest.count({
          where: { createdAt: { gte: monthStart, lte: monthEnd } },
        });
        poCount = await prisma.purchaseOrder.count({
          where: { createdAt: { gte: monthStart, lte: monthEnd } },
        });
        inCount = await prisma.stockMutation.count({
          where: { type: 'IN', createdAt: { gte: monthStart, lte: monthEnd } },
        });
        outCount = await prisma.stockMutation.count({
          where: { type: 'OUT', createdAt: { gte: monthStart, lte: monthEnd } },
        });

        return { label: format(date, 'MMM'), prCount, poCount, inCount, outCount };
      } else {
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);

        prCount = await prisma.purchaseRequest.count({
          where: { createdAt: { gte: dayStart, lte: dayEnd } },
        });
        poCount = await prisma.purchaseOrder.count({
          where: { createdAt: { gte: dayStart, lte: dayEnd } },
        });
        inCount = await prisma.stockMutation.count({
          where: { type: 'IN', createdAt: { gte: dayStart, lte: dayEnd } },
        });
        outCount = await prisma.stockMutation.count({
          where: { type: 'OUT', createdAt: { gte: dayStart, lte: dayEnd } },
        });

        return { label: format(date, 'dd MMM'), prCount, poCount, inCount, outCount };
      }
    })
  );

  // Recent data
  const recentPRs = await prisma.purchaseRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      createdAt: true,
      status: true,
      requestedBy: { select: { name: true } },
      approvedBy: { select: { name: true } },
    },
  });

  const recentPOs = await prisma.purchaseOrder.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      createdAt: true,
      status: true,
      supplier: { select: { name: true } },
      createdBy: { select: { name: true } },
    },
  });

  const recentMutations = await prisma.stockMutation.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      createdAt: true,
      type: true,
      quantity: true,
      rawMaterial: { select: { name: true } },
      createdBy: { select: { name: true } },
    },
  });

  return NextResponse.json({
    summary: {
      totalPurchaseRequests,
      totalPurchaseOrders,
      totalRawMaterials,
      totalStockMutationsIn,
      totalStockMutationsOut,
    },
    chartData,
    recentPRs: recentPRs.map((pr) => ({
      id: pr.id,
      createdAt: pr.createdAt,
      status: pr.status,
      createdBy: pr.requestedBy?.name ?? '-',
      approvedBy: pr.approvedBy?.name ?? '-',
    })),
    recentPOs: recentPOs.map((po) => ({
      id: po.id,
      createdAt: po.createdAt,
      status: po.status,
      supplierName: po.supplier?.name ?? '-',
      createdBy: po.createdBy?.name ?? '-',
    })),
    recentMutations: recentMutations.map((m) => ({
      id: m.id,
      createdAt: m.createdAt,
      type: m.type,
      quantity: m.quantity,
      material: m.rawMaterial?.name ?? '-',
      createdBy: m.createdBy?.name ?? '-',
    })),
  });
}
