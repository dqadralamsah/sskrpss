import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { status: 'OK', message: 'Database Connected Successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to Connect to Database' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
