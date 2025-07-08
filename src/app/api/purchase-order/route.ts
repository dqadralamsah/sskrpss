import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { generateNextId, generateNextIds } from '@/lib/id-generator';
import { NextRequest, NextResponse } from 'next/server';

// GET:
export async function GET() {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.purchaseOrder.findMany({
      include: {
        supplier: { select: { name: true } },
        createdBy: { select: { name: true } },
        items: {
          include: {
            rawMaterial: true,
            purchaseRequestItem: {
              include: {
                purchaseRequest: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('[PO_GET_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch purchase orders' }, { status: 500 });
  }
}

// POST:
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { supplierId, orderNotes, items } = body;

  if (!supplierId || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  try {
    const poId = await generateNextId('PRCHSRDR', 'purchaseOrder', 'id');
    const itemIds = await generateNextIds('POITMRDR', 'purchaseOrderItem', 'id', items.length);

    const filteredItems = items.filter((item: any) => item.rawMaterialId);

    const created = await prisma.purchaseOrder.create({
      data: {
        id: poId,
        createdById: session?.user?.id,
        supplierId,
        orderNotes,
        status: 'PENDING',
        items: {
          create: filteredItems.map((item: any, i: number) => ({
            id: itemIds[i],
            rawMaterialId: item.rawMaterialId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            status: 'PENDING',
            purchaseRequestItemId: item.purchaseRequestItemId || null,
          })),
        },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('[PO_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create purchase order' }, { status: 500 });
  }
}
