import { auth } from '@/lib/auth';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';
import NavbarWrapper from '@/components/navbar/navbarwrapper';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user.role !== 'Admin') {
    redirect('/unauthorized');
  }

  return (
    <>
      <SessionProvider session={session}>
        <NavbarWrapper session={session}>
          <main>{children}</main>
        </NavbarWrapper>
      </SessionProvider>
    </>
  );
}
