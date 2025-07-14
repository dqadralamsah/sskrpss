import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
  params: { id: string };
};

// GET /api/raw-material/[id]
export async function GET(req: NextRequest, { params }: Params) {
  const session = await auth();
  console.log('SESSION DARI POSTMAN:', session);
  const { id } = await params;

  if (!session || !['Admin', 'Purchasing', 'Warehouse'].includes(session.user.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }
  try {
    const material = await prisma.rawMaterial.findUnique({
      where: { id },
      include: {
        suppliers: {
          include: { supplier: true },
        },
      },
    });

    if (!material) {
      return NextResponse.json({ error: 'Raw material not found' }, { status: 404 });
    }

    const formatted = {
      id: material.id,
      name: material.name,
      stock: material.stock,
      unit: material.unit,
      minStock: material.minStock,
      maxStock: material.maxStock,
      safetyStock: material.safetyStock,
      description: material.description,
      createdAt: material.createdAt,
      suppliers: material.suppliers.map((s) => ({
        id: s.supplier.id,
        name: s.supplier.name,
        price: s.price.toNumber(),
        minOrder: s.minOrder,
      })),
    };

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error('[GET_RAW_MATERIAL_BY_ID]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/raw-material/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  const { id } = await params;

  if (!session || !['Admin', 'Purchasing', 'Warehouse'].includes(session.user.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, description, unit, minStock, maxStock, safetyStock, suppliers } = body;

    // Validasi input minimal
    if (!name || !unit || typeof minStock !== 'number') {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // Update bahan baku
    await prisma.rawMaterial.update({
      where: { id },
      data: {
        name,
        description,
        unit,
        minStock,
        maxStock,
        safetyStock,
      },
    });

    // Reset semua relasi supplier lama
    await prisma.rawMaterialSupplier.deleteMany({
      where: { rawMaterialId: id },
    });

    // Tambahkan supplier baru jika ada
    if (suppliers && Array.isArray(suppliers) && suppliers.length > 0) {
      await prisma.rawMaterialSupplier.createMany({
        data: suppliers.map((s: any) => ({
          rawMaterialId: id,
          supplierId: s.supplierId,
          price: parseFloat(s.price),
          minOrder: s.minOrder,
        })),
      });
    }

    return NextResponse.json({ message: 'Updated successfully' });
  } catch (error) {
    console.error('[PUT_RAW_MATERIAL]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
