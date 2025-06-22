import Navbar from '@/components/navbar/navbar';
import { auth } from '@/lib/auth';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user.role !== 'Purchasing') {
    redirect('/unauthorized');
  }

  return (
    <>
      <SessionProvider session={session}>
        <Navbar session={session} />
        <main>{children}</main>
      </SessionProvider>
    </>
  );
}
