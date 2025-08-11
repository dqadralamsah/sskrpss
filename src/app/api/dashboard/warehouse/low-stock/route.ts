import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const lowStockMaterials = await prisma.rawMaterial.findMany({
    where: {
      stock: {
        lt: prisma.rawMaterial.fields.minStock,
      },
    },
    select: {
      id: true,
      name: true,
      stock: true,
      minStock: true,
    },
  });

  return NextResponse.json(lowStockMaterials);
}
