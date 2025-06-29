import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const request = await prisma.purchaseRequest.findFirst({
      where: { id: params.id, requestedById: userId },
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
    console.error('[PR_USER_DETAIL_GET]', error);
    return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const request = await prisma.purchaseRequest.findUnique({ where: { id: params.id } });

    if (!request || request.requestedById !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.purchaseRequest.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('[PR_USER_DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
