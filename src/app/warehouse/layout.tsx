import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function WarehouseLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user.role !== 'Warehouse') {
    redirect('/unauthorized');
  }

  return (
    <>
      <main>{children}</main>
    </>
  );
}
