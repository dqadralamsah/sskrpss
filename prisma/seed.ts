import prisma from '@/lib/prisma';
import { users } from './users';
import bcrypt from 'bcryptjs';

async function main() {
  // Seed roles
  const roleNames = ['Admin', 'Purchasing', 'Warehouse'] as const;
  const roleMap: Record<string, string> = {};

  for (const name of roleNames) {
    let role = await prisma.role.findFirst({
      where: { name },
    });

    if (!role) {
      role = await prisma.role.create({
        data: { name },
      });
    }
    roleMap[name] = role.id;
  }

  // Seed users
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword,
        roleId: roleMap[user.role],
      },
    });
  }

  console.log('Seeding user dan role selesai.');
}

main().catch((err) => {
  console.error('Error saat seeding:', err);
  process.exit(1);
});
