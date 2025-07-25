import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: { id: string } };

// UPDATE
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing', 'Warehouse'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { quantity, description } = body;

    if (typeof quantity !== 'number') {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    // Cari data mutasi sebelumnya
    const existing = await prisma.stockMutation.findUnique({
      where: { id },
      include: { rawMaterial: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Mutation not found' }, { status: 404 });
    }

    if (existing.sourceType !== 'MANUAL') {
      return NextResponse.json({ error: 'Only manual mutations can be edited' }, { status: 400 });
    }

    // Hitung selisih quantity lama dan baru
    const diff = quantity - existing.quantity;
    const updateStock =
      existing.type === 'IN'
        ? existing.rawMaterial.stock + diff
        : existing.rawMaterial.stock - diff;

    // Simpan perubahan
    await prisma.$transaction([
      prisma.rawMaterial.update({
        where: { id: existing.rawMaterialId },
        data: { stock: updateStock },
      }),
      prisma.stockMutation.update({
        where: { id },
        data: {
          quantity,
          description,
        },
      }),
    ]);

    return NextResponse.json({ message: 'Updated successfully' });
  } catch (error) {
    console.error('[STOCK_MUTATION_PUT]', error);
    return NextResponse.json({ error: 'Failed to update mutation' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing', 'Warehouse'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const mutation = await prisma.stockMutation.findUnique({
      where: { id },
    });

    if (!mutation) {
      return NextResponse.json({ error: 'Mutation not found' }, { status: 404 });
    }

    // Ambil data
    const { rawMaterialId, quantity, type } = mutation;

    // Hitung rollback stock
    const stockDelta = type === 'IN' ? -quantity : quantity;

    // Lakukan update dan hapus dalam 1 transaksi
    await prisma.$transaction([
      prisma.rawMaterial.update({
        where: { id: rawMaterialId },
        data: { stock: { increment: stockDelta } },
      }),
      prisma.stockMutation.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({ message: 'Mutation deleted successfully' });
  } catch (error) {
    console.error('[DELETE_STOCK_MUTATION]', error);
    return NextResponse.json({ error: 'Failed to delete mutation' }, { status: 500 });
  }
}
