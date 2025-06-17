import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function PurchasingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user.role !== 'Purchasing') {
    redirect('/unauthorized');
  }

  return (
    <>
      <main>{children}</main>
    </>
  );
}
