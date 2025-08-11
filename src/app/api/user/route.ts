import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: { select: { name: true } },
      createdAt: true,
    },
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || session.user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, email, password, roleName } = body;

  // Validasi field
  if (!name || !email || !password || !roleName) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  // Cek apakah email sudah dipakai
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
  }

  // Cari role ID
  const role = await prisma.role.findFirst({
    where: { name: roleName }, // name di Role harus @unique
  });
  if (!role) {
    return NextResponse.json({ message: 'Role not found' }, { status: 404 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      roleId: role.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: { select: { name: true } },
      createdAt: true,
    },
  });

  return NextResponse.json(newUser, { status: 201 });
}
