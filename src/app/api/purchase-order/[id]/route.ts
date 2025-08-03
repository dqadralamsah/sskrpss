import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

type Params = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
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
    });

    if (!po) {
      return NextResponse.json({ message: 'Purchase Order not found' }, { status: 404 });
    }

    const totalPrice = po.items.reduce((sum, item) => {
      return sum + item.unitPrice.toNumber() * item.quantity;
    }, 0);

    return NextResponse.json({
      ...po,
      totalPrice,
      items: po.items.map((item) => ({
        ...item,
        unitPrice: item.unitPrice.toString(),
      })),
    });
  } catch (error) {
    console.error('[PO_DETAIL_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch purchase order' }, { status: 500 });
  }
}

// PUT
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = await params.id;

  try {
    const body = await req.json();
    const { supplierId, estimatedDate, orderNotes, items } = body;

    if (!supplierId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const filteredItems = items.filter(
      (item: any) => item.rawMaterialId && item.quantity && item.unitPrice
    );

    await prisma.$transaction([
      prisma.purchaseOrderItem.deleteMany({ where: { purchaseOrderId: params.id } }),

      prisma.purchaseOrder.update({
        where: { id },
        data: {
          supplierId,
          estimatedDate: new Date(estimatedDate),
          orderNotes,
          items: {
            create: filteredItems.map((item: any) => ({
              id: item.id || undefined, // pakai ID lama jika edit, atau biarkan generate otomatis
              rawMaterialId: item.rawMaterialId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              purchaseRequestItemId: item.purchaseRequestItemId || null,
              status: item.status || 'PENDING',
            })),
          },
        },
      }),
    ]);

    return NextResponse.json({ message: 'Purchase Order updated successfully' });
  } catch (error) {
    console.error('[PO_UPDATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update purchase order' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = await params.id;

  try {
    await prisma.purchaseOrder.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Purchase Order deleted successfully' });
  } catch (error) {
    console.error('[PO_DELETE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete purchase order' }, { status: 500 });
  }
}
