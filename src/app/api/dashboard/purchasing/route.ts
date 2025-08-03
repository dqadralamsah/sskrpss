import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfMonth, endOfMonth, startOfWeek, addWeeks } from 'date-fns';

export async function GET() {
  const now = new Date();
  const startMonth = startOfMonth(now);
  const endMonth = endOfMonth(now);

  // 1. Total PR & PO bulan ini
  const [totalPRThisMonth, totalPOThisMonth] = await Promise.all([
    prisma.purchaseRequest.count({
      where: { createdAt: { gte: startMonth, lte: endMonth } },
    }),
    prisma.purchaseOrder.count({
      where: { createdAt: { gte: startMonth, lte: endMonth } },
    }),
  ]);

  // 2. PR menunggu persetujuan
  const totalPendingPR = await prisma.purchaseRequest.count({
    where: { status: 'SUBMITTED' },
  });

  // 3. PO dalam status masih diproses (PENDING, PARTIAL, DELIVERY)
  const totalProcessingPO = await prisma.purchaseOrder.count({
    where: {
      status: { in: ['PENDING', 'PARTIAL', 'DELIVERY'] },
    },
  });

  // 4. PR yang belum dibuat PO
  const totalUnorderedPR = await prisma.purchaseRequestItem.count({
    where: {
      purchaseOrderItems: {
        none: {},
      },
    },
  });

  // 5. Total harga PO bulan ini (unitPrice * quantity)
  const poItemsThisMonth = await prisma.purchaseOrderItem.findMany({
    where: {
      createdAt: { gte: startMonth, lte: endMonth },
    },
    select: {
      quantity: true,
      unitPrice: true,
    },
  });

  const totalPricePOThisMonth = poItemsThisMonth.reduce((total, item) => {
    return total + Number(item.unitPrice) * item.quantity;
  }, 0);

  // 6. Weekly trend 4 minggu
  const weeklyTrend = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = startOfWeek(addWeeks(startMonth, i), { weekStartsOn: 1 });
    const weekEnd = addWeeks(weekStart, 1);

    const [pr, po] = await Promise.all([
      prisma.purchaseRequest.count({ where: { createdAt: { gte: weekStart, lt: weekEnd } } }),
      prisma.purchaseOrder.count({ where: { createdAt: { gte: weekStart, lt: weekEnd } } }),
    ]);

    weeklyTrend.push({
      week: `Week ${i + 1}`,
      pr,
      po,
    });
  }

  // 7. 5 PR & PO terbaru
  const [recentPR, recentPO] = await Promise.all([
    prisma.purchaseRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, createdAt: true, status: true },
    }),
    prisma.purchaseOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, createdAt: true, status: true },
    }),
  ]);

  // 8. Distribusi status PO
  const allPO = await prisma.purchaseOrder.findMany({
    select: { status: true },
  });

  const poStatusDistribution = allPO.reduce((acc, po) => {
    acc[po.status] = (acc[po.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return NextResponse.json({
    totalPRThisMonth,
    totalPOThisMonth,
    totalPendingPR,
    totalProcessingPO,
    totalUnorderedPR,
    totalPricePOThisMonth,
    weeklyTrend,
    recentPR,
    recentPO,
    poStatusDistribution,
  });
}
