import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: { id: string } };

// GET
export async function GET(_: NextRequest, { params }: Params) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
    });

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error('[SUPPLIER_GET_BY_ID]', error);
    return NextResponse.json({ error: 'Failed to fetch supplier' }, { status: 500 });
  }
}

// PUT
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updated = await prisma.supplier.update({
      where: { id: params.id },
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[SUPPLIER_PUT]', error);
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await prisma.supplier.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SUPPLIER_DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 });
  }
}
