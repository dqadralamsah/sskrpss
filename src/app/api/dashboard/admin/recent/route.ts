import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const [recentPRs, recentPOs] = await Promise.all([
    prisma.purchaseRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        status: true,
      },
    }),
    prisma.purchaseOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        status: true,
        supplier: { select: { name: true } },
      },
    }),
  ]);

  return NextResponse.json({
    recentPRs,
    recentPOs: recentPOs.map((po) => ({
      ...po,
      supplierName: po.supplier.name,
    })),
  });
}
