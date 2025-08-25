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
  const limit = parseInt(searchParams.get('limit') || '5');

  let startDate: Date;
  let endDate: Date;

  switch (period) {
    case 'today':
      startDate = startOfDay(new Date());
      endDate = endOfDay(new Date());
      break;
    case 'last_7_days':
      startDate = startOfDay(subDays(new Date(), 6));
      endDate = endOfDay(new Date());
      break;
    case 'last_month':
      startDate = startOfMonth(subDays(new Date(), 30));
      endDate = endOfMonth(subDays(new Date(), 30));
      break;
    case 'this_year':
      startDate = startOfYear(new Date());
      endDate = endOfYear(new Date());
      break;
    default:
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
      break;
  }

  const recentPRs = await prisma.purchaseRequest.findMany({
    where: { createdAt: { gte: startDate, lte: endDate } },
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
    where: { createdAt: { gte: startDate, lte: endDate } },
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

  return NextResponse.json({
    recentPRs: recentPRs.map((pr) => ({
      id: pr.id,
      createdAt: pr.createdAt,
      status: pr.status,
      createdBy: pr.requestedBy?.name || '-',
      approvedBy: pr.approvedBy?.name || '-',
    })),
    recentPOs: recentPOs.map((po) => ({
      id: po.id,
      createdAt: po.createdAt,
      status: po.status,
      supplierName: po.supplier?.name || '-',
      createdBy: po.createdBy?.name || '-',
    })),
  });
}
