import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateNextId } from '@/lib/id-generator';
import { NextRequest, NextResponse } from 'next/server';

// POST:
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing', 'Warehouse'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      name,
      unit,
      stock = 0,
      minStock = 0,
      maxStock = 0,
      safetyStock = 0,
      description,
      suppliers = [],
    } = body;

    // Validasi
    if (!name || !unit) {
      return NextResponse.json({ message: 'Nama and Unit are Required' }, { status: 400 });
    }

    if (!Array.isArray(suppliers)) {
      return NextResponse.json({ error: 'SupplierIds mush be an array' }, { status: 400 });
    }

    const id = await generateNextId('RMTRL', 'rawMaterial', 'id');

    const created = await prisma.rawMaterial.create({
      data: {
        id,
        name,
        description,
        stock,
        unit,
        minStock,
        maxStock,
        safetyStock,
        suppliers: {
          create: suppliers.map(
            (item: { supplierId: string; price: number; minOrder: number }) => ({
              supplier: { connect: { id: item.supplierId } },
              price: item.price,
              minOrder: item.minOrder,
            })
          ),
        },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add raw material' }, { status: 500 });
  }
}

// GET:
export async function GET() {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing', 'Warehouse'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const materials = await prisma.rawMaterial.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        suppliers: {
          include: {
            supplier: true,
          },
        },
      },
    });

    return NextResponse.json(materials);
  } catch (error) {
    console.error('[RAW_MATERIAL_GET]', error);
    return NextResponse.json({ error: 'Gagal mengambil data bahan baku' }, { status: 500 });
  }
}
