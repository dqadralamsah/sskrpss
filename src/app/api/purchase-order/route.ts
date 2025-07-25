import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { generateNextId, generateNextIds } from '@/lib/id-generator';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/purchase-order
export async function GET() {
  const session = await auth();
  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        createdBy: true,
        items: {
          include: {
            rawMaterial: true,
            purchaseRequestItem: { include: { purchaseRequest: true } },
            receivedBy: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const serialized = orders.map((order) => {
      const totalPrice = order.items.reduce((sum, item) => {
        return sum + item.unitPrice.toNumber() * item.quantity;
      }, 0);

      return {
        ...order,
        totalPrice,
        items: order.items.map((item) => ({
          ...item,
          unitPrice: item.unitPrice.toString(),
        })),
      };
    });

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('[PO_GET_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch purchase orders' }, { status: 500 });
  }
}

// POST /api/purchase-order
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { supplierId, estimatedDate, orderNotes, items } = body;

    if (!supplierId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const filteredItems = items.filter(
      (item: any) => item.rawMaterialId && item.quantity && item.unitPrice
    );

    if (filteredItems.length === 0) {
      return NextResponse.json({ message: 'No valid item found' }, { status: 400 });
    }

    const poId = await generateNextId('PRCOR', 'purchaseOrder', 'id');
    const itemIds = await generateNextIds('POITM', 'purchaseOrderItem', 'id', filteredItems.length);

    const created = await prisma.purchaseOrder.create({
      data: {
        id: poId,
        createdById: session.user.id,
        supplierId,
        estimatedDate: estimatedDate ? new Date(estimatedDate) : new Date(),
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
      include: {
        supplier: true,
        createdBy: true,
        items: {
          include: {
            rawMaterial: true,
            purchaseRequestItem: true,
            receivedBy: true,
          },
        },
      },
    });

    const totalPrice = created.items.reduce((sum, item) => {
      return sum + item.unitPrice.toNumber() * item.quantity;
    }, 0);

    return NextResponse.json(
      {
        ...created,
        totalPrice,
        items: created.items.map((item) => ({
          ...item,
          unitPrice: item.unitPrice.toString(),
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[PO_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create purchase order' }, { status: 500 });
  }
}
