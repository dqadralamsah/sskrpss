import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const materials = await prisma.rawMaterial.findMany({
      select: {
        id: true,
        name: true,
        unit: true,
      },
    });

    return NextResponse.json(materials);
  } catch (error) {
    console.error('[RAW_MATERIAL_GET]', error);
    return NextResponse.json({ error: 'Gagal mengambil data bahan baku' }, { status: 500 });
  }
}
