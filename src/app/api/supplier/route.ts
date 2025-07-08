import { auth } from '@/lib/auth';
import { generateNextId } from '@/lib/id-generator';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET
export async function GET() {
  const session = await auth();
  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        materials: {
          include: {
            rawMaterial: true,
          },
        },
      },
    });
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error('[SUPPLIER_GET]', error);
    return NextResponse.json({ error: 'Failed to fetch data supplier' }, { status: 500 });
  }
}

// POST
export async function POST(req: Request) {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, email, phone } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const id = await generateNextId('SPPLR', 'supplier', 'id');

    const newSupplier = await prisma.supplier.create({
      data: {
        id,
        name,
        email,
        phone,
      },
    });

    return NextResponse.json(newSupplier);
  } catch (error) {
    console.error('[SUPPLIER_POST]', error);
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}
