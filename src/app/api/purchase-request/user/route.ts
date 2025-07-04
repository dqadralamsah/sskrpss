import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET: Ambil semua PR milik user
export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const purchaseRequests = await prisma.purchaseRequest.findMany({
      where: {
        requestedById: userId,
      },
      include: {
        items: {
          include: {
            rawMaterial: true,
          },
        },
        approvedBy: {
          select: {
            name: true,
          },
        },
        PurchaseRequestRevisionLog: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(purchaseRequests);
  } catch (error) {
    console.log('[PR_USER_GET'), error;
    return NextResponse.json({ error: 'Failed to fetch user requests' }, { status: 500 });
  }
}

// POST: Input Data Baru
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { description, items } = body;

    if (!description || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Description and items are required' }, { status: 400 });
    }

    const newRequest = await prisma.purchaseRequest.create({
      data: {
        requestedById: userId,
        description,
        status: 'SUBMITTED',
        items: {
          create: items.map((item: { rawMaterialId: string; quantity: number }) => ({
            rawMaterialId: item.rawMaterialId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            rawMaterial: true,
          },
        },
        requestedBy: true,
      },
    });
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.log('[PR_USER_POST]', error);
    return NextResponse.json({ error: 'Failed to create purchase request' }, { status: 500 });
  }
}
