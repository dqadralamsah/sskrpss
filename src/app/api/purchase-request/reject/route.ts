import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const updated = await prisma.purchaseRequest.update({
    where: { id },
    data: {
      status: 'REJECTED',
      approvedById: session.user.id,
    },
  });

  return NextResponse.json(updated);
}
