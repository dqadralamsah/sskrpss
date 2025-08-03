import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MutationType } from '@/generated/prisma';

export async function GET(req: NextRequest) {
  try {
    const [totalStock, lowStockItems, recentMutations, chartData] = await Promise.all([
      getTotalStock(),
      prisma.rawMaterial.findMany({
        where: {
          stock: { lt: prisma.rawMaterial.fields.minStock },
        },
        take: 5,
        orderBy: { stock: 'asc' },
      }),
      prisma.stockMutation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { rawMaterial: true },
      }),
      getStockMutationChartData(),
    ]);

    return NextResponse.json({
      totalStock,
      lowStockItems,
      recentMutations,
      chartData,
    });
  } catch (error) {
    console.error('Warehouse Dashboard Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function getTotalStock() {
  const result = await prisma.rawMaterial.aggregate({
    _sum: { stock: true },
  });

  return result._sum.stock ?? 0;
}

async function getStockMutationChartData() {
  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - 6);

  const mutations = await prisma.stockMutation.findMany({
    where: { createdAt: { gte: start } },
    select: { createdAt: true, type: true, quantity: true },
  });

  const map = new Map<string, { in: number; out: number }>();

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const key = date.toISOString().split('T')[0];
    map.set(key, { in: 0, out: 0 });
  }

  mutations.forEach(({ createdAt, type, quantity }) => {
    const key = createdAt.toISOString().split('T')[0];
    const current = map.get(key);
    if (!current) return;
    if (type === MutationType.IN) current.in += quantity;
    else if (type === MutationType.OUT) current.out += quantity;
  });

  return Array.from(map.entries()).map(([date, { in: _in, out }]) => ({
    date,
    in: _in,
    out,
  }));
}
