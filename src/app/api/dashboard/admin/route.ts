// src/app/api/dashboard/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  const startDate = start
    ? new Date(start)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endDate = end ? new Date(end) : new Date();

  // ========================
  // 1. SUMMARY
  // ========================
  const prSummary = await prisma.purchaseRequest.groupBy({
    by: ['status'],
    where: { createdAt: { gte: startDate, lte: endDate } },
    _count: { _all: true },
  });

  const poSummary = await prisma.purchaseOrder.groupBy({
    by: ['status'],
    where: { createdAt: { gte: startDate, lte: endDate } },
    _count: { _all: true },
  });

  const stock = await prisma.rawMaterial.findMany({
    select: { id: true, name: true, stock: true, minStock: true, maxStock: true },
  });

  const stockSummary = {
    low: stock.filter((s) => s.stock < s.minStock).length,
    normal: stock.filter((s) => s.stock >= s.minStock && s.stock <= s.maxStock).length,
    over: stock.filter((s) => s.stock > s.maxStock).length,
  };

  // ========================
  // 2. CHART: STOCK MUTATION
  // ========================
  const stockMutations = await prisma.stockMutation.findMany({
    where: { createdAt: { gte: startDate, lte: endDate } },
    select: { createdAt: true, type: true, quantity: true },
    orderBy: { createdAt: 'asc' },
  });

  const mutationByDate: Record<string, { in: number; out: number }> = {};
  stockMutations.forEach((m) => {
    const date = m.createdAt.toISOString().split('T')[0];
    if (!mutationByDate[date]) mutationByDate[date] = { in: 0, out: 0 };
    if (m.type === 'IN') mutationByDate[date].in += m.quantity;
    if (m.type === 'OUT') mutationByDate[date].out += m.quantity;
  });

  const mutationChart = Object.entries(mutationByDate).map(([date, val]) => ({
    date,
    ...val,
  }));

  // ========================
  // 3. CHART: PR & PO
  // ========================
  const prChart = prSummary.map((s) => ({
    status: s.status,
    count: s._count._all,
  }));

  const poChart = poSummary.map((s) => ({
    status: s.status,
    count: s._count._all,
  }));

  // ========================
  // 4. RECENT ACTIVITY
  // ========================
  const recentPR = await prisma.purchaseRequest.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { requestedBy: { select: { name: true } }, approvedBy: { select: { name: true } } },
  });

  const recentPO = await prisma.purchaseOrder.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { createdBy: { select: { name: true } }, supplier: { select: { name: true } } },
  });

  const recentMutations = await prisma.stockMutation.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      rawMaterial: { select: { name: true } },
      createdBy: { select: { name: true } },
    },
  });

  const recent = [
    ...recentPR.map((r) => ({
      type: 'PR',
      id: r.id,
      status: r.status,
      requestedBy: r.requestedBy?.name,
      approvedBy: r.approvedBy?.name,
      date: r.createdAt,
    })),
    ...recentPO.map((r) => ({
      type: 'PO',
      id: r.id,
      status: r.status,
      createdBy: r.createdBy?.name,
      supplier: r.supplier?.name,
      date: r.createdAt,
    })),
    ...recentMutations.map((m) => ({
      type: 'MUTATION',
      id: m.id,
      mutationType: m.type,
      material: m.rawMaterial.name,
      qty: m.quantity,
      user: m.createdBy?.name,
      date: m.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  // ========================
  // RETURN JSON
  // ========================
  return NextResponse.json({
    range: { startDate, endDate },
    summary: {
      purchaseRequests: prSummary,
      purchaseOrders: poSummary,
      stock: stockSummary,
    },
    chart: {
      stockMutation: mutationChart,
      purchaseRequests: prChart,
      purchaseOrders: poChart,
    },
    recent,
  });
}
