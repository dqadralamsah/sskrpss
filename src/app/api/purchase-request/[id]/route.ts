import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

type Context = {
  params: { id: string };
};

export async function GET(_: Request, { params }: Context) {
  const session = await auth();
  const role = session?.user?.role;

  if (!role || !['admin', 'purchasing'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const request = await prisma.purchaseRequest.findUnique({
      where: { id: params.id },
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

export async function DELETE(_: Request, { params }: Context) {
  const session = await auth();
  const role = session?.user?.role;

  if (!role || !['admin', 'purchasing'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await prisma.purchaseRequest.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[PR_DETAIL_DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
