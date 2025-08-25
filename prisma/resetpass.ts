import prisma from '@/lib/prisma'; // pastikan path sesuai dengan project
import bcrypt from 'bcryptjs';

async function main() {
  // 1. Ganti sesuai email admin
  const adminEmail = 'dqadralamsah@gmail.com';

  // 2. Password baru
  const newPassword = 'admin123';

  // 3. Generate hash password
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  // 4. Update user admin di database
  const updatedAdmin = await prisma.user.update({
    where: { email: adminEmail },
    data: { password: hashedPassword },
  });

  console.log(`Password admin berhasil di-reset!`);
  console.log(`Email: ${updatedAdmin.email}`);
  console.log(`Password baru: ${newPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
