import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const session = await auth();
  const { description, items } = await req.json();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Minimal 1 item diperlukan' }, { status: 400 });
  }

  // Pastikan PR milik user dan sedang REVISION
  const existing = await prisma.purchaseRequest.findUnique({
    where: { id },
    select: {
      requestedById: true,
      status: true,
    },
  });

  if (!existing || existing.requestedById !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (existing.status !== 'REVISION') {
    return NextResponse.json({ error: 'PR ini tidak sedang dalam status revisi' }, { status: 400 });
  }

  try {
    // Hapus item lama
    await prisma.purchaseRequestItem.deleteMany({
      where: { purchaseRequestId: id },
    });

    // Tambahkan item baru & update deskripsi + status
    const updated = await prisma.purchaseRequest.update({
      where: { id },
      data: {
        description,
        status: 'SUBMITTED',
        items: {
          create: items.map((item: { rawMaterialId: string; quantity: number }) => ({
            rawMaterialId: item.rawMaterialId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: { include: { rawMaterial: true } },
        requestedBy: true,
        approvedBy: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PR_PATHC_ERROR]', error);
    return NextResponse.json({ error: 'Gagal memperbarui Purchase Request' }, { status: 500 });
  }
}
