import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { subMonths, format } from 'date-fns';

export async function GET() {
  const now = new Date();

  // ambil 12 bulan terakhir, terbaru di belakang
  const months = Array.from({ length: 12 }).map((_, i) => {
    const date = subMonths(now, 11 - i);
    return {
      label: format(date, 'MMM'), // contoh: Jan, Feb
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    };
  });

  const prGroup = await prisma.purchaseRequest.groupBy({
    by: ['createdAt'],
    _count: true,
  });

  const poGroup = await prisma.purchaseOrder.groupBy({
    by: ['createdAt'],
    _count: true,
  });

  const data = months.map(({ label, year, month }) => {
    const prCount = prGroup.filter(
      (g) => g.createdAt.getFullYear() === year && g.createdAt.getMonth() + 1 === month
    ).length;

    const poCount = poGroup.filter(
      (g) => g.createdAt.getFullYear() === year && g.createdAt.getMonth() + 1 === month
    ).length;

    return { month: label, prCount, poCount };
  });

  return NextResponse.json({ data });
}
