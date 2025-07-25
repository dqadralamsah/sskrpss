import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { generateNextId } from '@/lib/id-generator';
import { stockMutationSchema } from '@/app/features/inventory/schema';

// GET
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || !['Admin', 'Purchasing', 'Warehouse'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rawMaterialId = req.nextUrl.searchParams.get('rawMaterialId');
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');

  if (!rawMaterialId) {
    return NextResponse.json({ message: 'Missing rawMaterialId' }, { status: 400 });
  }

  const skip = (page - 1) * limit;

  try {
    const [data, total] = await prisma.$transaction([
      prisma.stockMutation.findMany({
        where: { rawMaterialId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          purchaseOrder: {
            include: { supplier: true },
          },
        },
      }),
      prisma.stockMutation.count({
        where: { rawMaterialId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ data, total, page, limit, totalPages });
  } catch (error) {
    console.error('[STOCK_MUTATION_GET]', error);
    return NextResponse.json({ message: 'Failed to fetch stock mutation' }, { status: 500 });
  }
}

// POST
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !['Admin', 'Purchasing', 'Warehouse'].includes(session.user.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = stockMutationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { rawMaterialId, type, sourceType, sourceId, quantity, description } = parsed.data;

    const id = await generateNextId('STMTN', 'stockMutation', 'id');

    // Transaction: Create mutation + Update stok
    const mutation = await prisma.$transaction(async (tx) => {
      // 1. Create mutation
      const record = await tx.stockMutation.create({
        data: {
          id,
          rawMaterialId,
          type,
          sourceType,
          sourceId: sourceId ?? null,
          quantity,
          description: description ?? null,
          createdById: session.user.id,
        },
      });

      // 2. Update stock based on sourceType
      if (sourceType === 'OPNAME') {
        // Replace total stock (e.g. stock take OPNAME)
        await tx.rawMaterial.update({
          where: { id: rawMaterialId },
          data: { stock: quantity },
        });
      } else {
        // Tambah atau Kurangi
        await tx.rawMaterial.update({
          where: { id: rawMaterialId },
          data: {
            stock: {
              increment: type === 'IN' ? quantity : -quantity,
            },
          },
        });
      }

      return record;
    });

    return NextResponse.json(
      { message: 'Stock mutation recorded', data: mutation },
      { status: 201 }
    );
  } catch (error) {
    console.error('[STOCK_MUTATION_POST]', error);
    return NextResponse.json({ error: 'Failed to record Stock mutation' }, { status: 500 });
  }
}
