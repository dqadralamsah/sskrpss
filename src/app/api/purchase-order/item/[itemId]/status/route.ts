import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const VALID_STATUSES = ['PENDING', 'DELIVERY', 'RECEIVED', 'CANCELLED'] as const;

export async function PATCH(req: NextRequest, { params }: { params: { itemId: string } }) {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const { status, receivedQty } = body;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  if (status === 'RECEIVED') {
    if (typeof receivedQty !== 'number' || receivedQty < 0) {
      return NextResponse.json({ error: 'Invalid received quantity' }, { status: 400 });
    }
  }

  try {
    const updatedItem = await prisma.purchaseOrderItem.update({
      where: { id: params.itemId },
      data: {
        status,
        receivedQty: status === 'RECEIVED' ? receivedQty ?? 0 : undefined,
        receivedDate: status === 'RECEIVED' ? new Date() : undefined,
      },
    });

    const allItems = await prisma.purchaseOrderItem.findMany({
      where: { purchaseOrderId: updatedItem.purchaseOrderId },
      select: { status: true },
    });

    const statuses = allItems.map((i) => i.status);

    let overallStatus: 'PENDING' | 'DELIVERY' | 'RECEIVED' | 'PARTIAL' | 'CANCELLED' = 'PENDING';

    if (statuses.every((s) => s === 'CANCELLED')) {
      overallStatus = 'CANCELLED';
    } else if (statuses.every((s) => s === 'RECEIVED')) {
      overallStatus = 'RECEIVED';
    } else if (statuses.every((s) => s === 'DELIVERY')) {
      overallStatus = 'DELIVERY';
    } else if (statuses.some((s) => s === 'RECEIVED' || s === 'DELIVERY')) {
      overallStatus = 'PARTIAL';
    }

    await prisma.purchaseOrder.update({
      where: { id: updatedItem.purchaseOrderId },
      data: { status: overallStatus },
    });

    return NextResponse.json({ message: 'Item and PO status updated' });
  } catch (error) {
    console.error('[ITEM_STATUS_UPDATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update item status' }, { status: 500 });
  }
}
