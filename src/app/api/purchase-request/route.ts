import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  const role = session?.user?.role;

  if (!role || !['Admin', 'Purchasing'].includes(role)) {
    return NextResponse.json([{ error: 'Unauthorized' }], { status: 403 });
  }

  try {
    const purchaseRequests = await prisma.purchaseRequest.findMany({
      include: {
        items: {
          include: {
            rawMaterial: true,
          },
        },
        requestedBy: true,
        approvedBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(purchaseRequests);
  } catch (error) {
    console.log('[PR_ALL_GET]', error);
    return NextResponse.json({ error: 'Failed to fetch purchase requests' }, { status: 500 });
  }
}
