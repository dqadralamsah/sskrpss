import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Context = {
  params: { id: string };
};

export async function PATCH(req: Request, { params }: Context) {
  const session = await auth();
  const role = session?.user?.role;

  if (!role || !['admin', 'purchasing'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { reason } = await req.json();

    if (!reason || typeof reason !== 'string') {
      return NextResponse.json({ error: 'Reason is required' }, { status: 400 });
    }

    const rejected = await prisma.purchaseRequest.update({
      where: { id: params.id },
      data: {
        status: 'REJECTED',
      },
    });

    return NextResponse.json(rejected);
  } catch (error) {
    console.error('[PR_REJECT]', error);
    return NextResponse.json({ error: 'Failed to reject request' }, { status: 500 });
  }
}
