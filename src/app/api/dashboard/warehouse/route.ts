import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfMonth } from 'date-fns';

export async function GET() {
  const now = new Date();
  const monthStart = startOfMonth(now);

  const [totalRawMaterials, stockIn, stockOut, lowStock] = await Promise.all([
    prisma.rawMaterial.count(),
    prisma.stockMutation.aggregate({
      _sum: { quantity: true },
      where: { type: 'IN', createdAt: { gte: monthStart } },
    }),
    prisma.stockMutation.aggregate({
      _sum: { quantity: true },
      where: { type: 'OUT', createdAt: { gte: monthStart } },
    }),
    prisma.rawMaterial.count({
      where: {
        stock: { lt: prisma.rawMaterial.fields.minStock },
      },
    }),
  ]);

  const poReceivedThisMonth = await prisma.purchaseOrderItem.findMany({
    where: {
      receivedDate: { gte: monthStart },
    },
    select: {
      purchaseOrderId: true,
    },
    distinct: ['purchaseOrderId'],
  });

  return NextResponse.json({
    totalRawMaterials,
    stockInThisMonth: stockIn._sum.quantity || 0,
    stockOutThisMonth: stockOut._sum.quantity || 0,
    poReceivedThisMonth: poReceivedThisMonth.length,
    lowStockCount: lowStock,
  });
}
