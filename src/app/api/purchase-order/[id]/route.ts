import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// GET:
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id: params.id },
      include: {
        supplier: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        items: {
          include: {
            rawMaterial: { select: { id: true, name: true, unit: true } },
            purchaseRequestItem: {
              select: {
                id: true,
                purchaseRequest: {
                  select: { id: true, requestedBy: { select: { name: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ message: 'Purchase Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('[PO_DETAIL_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch purchase order detail' }, { status: 500 });
  }
}

// DELETE:
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: params.id },
      select: { id: true, status: true },
    });

    if (!po) {
      return NextResponse.json({ error: 'Purchase Order not found' }, { status: 404 });
    }

    if (po.status !== 'PENDING') {
      return NextResponse.json({ error: 'Only PENDING PO can be deleted' }, { status: 400 });
    }

    await prisma.purchaseOrder.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Purchase Order deleted successfully' });
  } catch (error) {
    console.error('[PO_DELETE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete purchase order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const { supplierId, orderNotes, items } = body;

  if (!supplierId || !Array.isArray(items)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    // Cek PO dan pastikan masih bisa diedit
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!po) {
      return NextResponse.json({ error: 'Purchase Order not found' }, { status: 404 });
    }

    if (po.status !== 'PENDING') {
      return NextResponse.json({ error: 'Only PENDING PO can be edited' }, { status: 400 });
    }

    // Update PO (supplier dan notes)
    await prisma.purchaseOrder.update({
      where: { id: params.id },
      data: {
        supplierId,
        orderNotes,
      },
    });

    // Update setiap item yang dikirim
    for (const updatedItem of items) {
      await prisma.purchaseOrderItem.update({
        where: { id: updatedItem.id },
        data: {
          quantity: updatedItem.quantity,
          unitPrice: updatedItem.unitPrice,
        },
      });
    }

    return NextResponse.json({ message: 'Purchase Order updated successfully' });
  } catch (error) {
    console.error('[PO_UPDATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update purchase order' }, { status: 500 });
  }
}
