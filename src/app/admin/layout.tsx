import Navbar from '@/components/navbar/navbar';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user.role !== 'Admin') {
    redirect('/unauthorized');
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
