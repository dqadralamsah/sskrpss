import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const [totalPurchaseRequests, totalPurchaseOrders, totalRawMaterials, totalStockMutations] =
    await Promise.all([
      prisma.purchaseRequest.count(),
      prisma.purchaseOrder.count(),
      prisma.rawMaterial.count(),
      prisma.stockMutation.count(),
    ]);

  return NextResponse.json({
    totalPurchaseRequests,
    totalPurchaseOrders,
    totalRawMaterials,
    totalStockMutations,
  });
}
