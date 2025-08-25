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
} from 'date-fns';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'this_month';
  const customDate = searchParams.get('date');

  let startDate: Date;
  let endDate: Date;

  if (period === 'today') {
    startDate = startOfDay(new Date());
    endDate = endOfDay(new Date());
  } else if (period === 'last_7_days') {
    startDate = startOfDay(subDays(new Date(), 6));
    endDate = endOfDay(new Date());
  } else if (period === 'this_month') {
    startDate = startOfMonth(new Date());
    endDate = endOfMonth(new Date());
  } else if (period === 'last_month') {
    const date = subDays(startOfMonth(new Date()), 1);
    startDate = startOfMonth(date);
    endDate = endOfMonth(date);
  } else if (period === 'this_year') {
    startDate = startOfYear(new Date());
    endDate = endOfYear(new Date());
  } else if (period === 'custom' && customDate) {
    const date = new Date(customDate);
    startDate = startOfDay(date);
    endDate = endOfDay(date);
  } else {
    startDate = startOfMonth(new Date());
    endDate = endOfMonth(new Date());
  }

  const [
    totalPurchaseRequests,
    totalPurchaseOrders,
    totalRawMaterials,
    totalStockMutationsIn,
    totalStockMutationsOut,
  ] = await Promise.all([
    prisma.purchaseRequest.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
    prisma.purchaseOrder.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
    prisma.rawMaterial.count(),
    prisma.stockMutation.count({
      where: { type: 'IN', createdAt: { gte: startDate, lte: endDate } },
    }),
    prisma.stockMutation.count({
      where: { type: 'OUT', createdAt: { gte: startDate, lte: endDate } },
    }),
  ]);

  return NextResponse.json({
    totalPurchaseRequests,
    totalPurchaseOrders,
    totalRawMaterials,
    totalStockMutationsIn,
    totalStockMutationsOut,
  });
}
