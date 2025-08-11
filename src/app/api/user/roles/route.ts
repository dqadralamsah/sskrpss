import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  const roles = await prisma.role.findMany({
    select: { id: true, name: true },
  });

  return NextResponse.json(roles);
}
