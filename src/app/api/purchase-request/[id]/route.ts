import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: { id: string };
};

// GET /api/purchase-request/:id
export async function GET(_: NextRequest, { params }: Context) {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const request = await prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        items: { include: { rawMaterial: true } },
        requestedBy: true,
        approvedBy: true,
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(request);
  } catch (error) {
    console.error('[PR_DETAIL_GET]', error);
    return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 });
  }
}

// DELETE /api/purchase-request/:id
export async function DELETE(_: NextRequest, { params }: Context) {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await prisma.purchaseRequest.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[PR_DETAIL_DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
