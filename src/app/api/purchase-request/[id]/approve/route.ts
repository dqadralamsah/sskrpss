import { auth } from '@//lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Context = {
  params: { id: string };
};

export async function PATCH(_: Request, { params }: Context) {
  const session = await auth();
  const userId = session?.user?.id;
  const role = session?.user?.role;

  if (!userId || !role || !['admin', 'purchasing'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const approved = await prisma.purchaseRequest.update({
      where: { id: params.id },
      data: {
        status: 'APPROVED',
        approvedById: userId,
      },
    });

    return NextResponse.json(approved);
  } catch (error) {
    console.error('[PR_APPROVE]', error);
    return NextResponse.json({ error: 'Failed to approve request' }, { status: 500 });
  }
}
