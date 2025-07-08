import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id, revisionNote } = await req.json();

    if (!id || !revisionNote?.trim()) {
      return NextResponse.json({ error: 'ID dan catatan revisi dibutuhkan' }, { status: 400 });
    }

    // 1. Update status
    await prisma.purchaseRequest.update({
      where: { id },
      data: { status: 'REVISION' },
    });

    // 2. Simpan log revisi
    await prisma.purchaseRequestRevisionLog.create({
      data: {
        purchaseRequestId: id,
        revisedById: session.user.id,
        revisionNote,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PR_REVISE_ERROR]', error);
    return NextResponse.json({ error: 'Gagal merevisi request' }, { status: 500 });
  }
}
