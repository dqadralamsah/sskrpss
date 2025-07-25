import prisma from '@/lib/prisma';
import { PurchaseOrderItemStatus } from '@/generated/prisma';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { generateNextIds } from '@/lib/id-generator';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  const { id: purchaseOrderId } = params;

  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const { items, receivedById } = body;

  try {
    const poItems = await prisma.purchaseOrderItem.findMany({
      where: { purchaseOrderId },
    });

    if (poItems.length === 0) {
      return NextResponse.json(
        { message: 'Purchase Order not found or has no items' },
        { status: 404 }
      );
    }

    const updatedItems = [];
    const validItems = items.filter((item: any) => {
      const existingItem = poItems.find((i) => i.id === item.itemId);
      if (!existingItem) return false;

      const totalReceived = existingItem.receivedQty + item.receivedQty;
      return totalReceived <= existingItem.quantity;
    });

    // Generate IDs untuk stock mutation
    const mutationIds = await generateNextIds('STMTN', 'stockMutation', 'id', validItems.length);
    let mutationIndex = 0;

    for (const item of items) {
      const existingItem = poItems.find((i) => i.id === item.itemId);
      if (!existingItem) continue;

      const totalReceived = existingItem.receivedQty + item.receivedQty;

      // Validasi jumlah diterima
      if (totalReceived > existingItem.quantity) {
        return NextResponse.json(
          { message: `Received quantity for item ${existingItem.id} exceeds ordered quantity.` },
          { status: 400 }
        );
      }

      // Update item PO
      const newStatus: PurchaseOrderItemStatus =
        totalReceived >= existingItem.quantity ? 'RECEIVED' : 'DELIVERY';

      const updated = await prisma.purchaseOrderItem.update({
        where: { id: item.itemId },
        data: {
          receivedQty: totalReceived,
          receivedDate: new Date(),
          receivedById,
          status: newStatus,
        },
      });

      updatedItems.push(updated);

      // Gunakan ID dari array
      const mutationId = mutationIds[mutationIndex++];

      await prisma.stockMutation.create({
        data: {
          id: mutationId,
          rawMaterialId: existingItem.rawMaterialId,
          type: 'IN',
          sourceType: 'PO',
          sourceId: purchaseOrderId,
          quantity: item.receivedQty,
          createdById: session.user.id,
        },
      });

      await prisma.rawMaterial.update({
        where: { id: existingItem.rawMaterialId },
        data: {
          stock: {
            increment: item.receivedQty,
          },
        },
      });
    }

    // Update status PO berdasarkan item
    const finalItems = await prisma.purchaseOrderItem.findMany({
      where: { purchaseOrderId },
    });

    const allReceived = finalItems.every((item) => item.status === 'RECEIVED');
    const hasReceived = finalItems.some((item) => item.status !== 'PENDING');

    const newPOStatus = allReceived ? 'RECEIVED' : hasReceived ? 'DELIVERY' : 'PENDING';

    await prisma.purchaseOrder.update({
      where: { id: purchaseOrderId },
      data: {
        status: newPOStatus,
      },
    });

    return NextResponse.json({
      message: 'Purchase Order received successfully',
      updatedItems,
    });
  } catch (error) {
    console.error('[RECEIVE_PO_ERROR]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
