import { auth } from '@/lib/auth';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';
import NavbarWrapper from '@/components/navbar/navbarwrapper';

export default async function PurchasingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user.role !== 'Purchasing') {
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
