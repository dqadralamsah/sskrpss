import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (!session || !['Admin', 'Purchasing'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const approvedPRs = await prisma.purchaseRequest.findMany({
      where: {
        status: 'APPROVED',
        items: {
          some: {
            purchaseOrderItems: {
              none: {},
            },
          },
        },
      },
      include: {
        requestedBy: { select: { name: true } },
        approvedBy: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(approvedPRs);
  } catch (error) {
    console.error('[PR_APPROVED_FOR_PO_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch PRs' }, { status: 500 });
  }
}
