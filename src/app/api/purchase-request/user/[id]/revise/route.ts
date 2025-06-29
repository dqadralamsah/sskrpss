import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const request = await prisma.purchaseRequest.findUnique({ where: { id: params.id } });

    if (!request || request.requestedById !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const revisedRequest = await prisma.purchaseRequest.update({
      where: { id: params.id },
      data: {
        ...body,
        status: 'REVISED',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(revisedRequest);
  } catch (error) {
    console.error('[PR_USER_REVISE]', error);
    return NextResponse.json({ error: 'Failed to revise request' }, { status: 500 });
  }
}
