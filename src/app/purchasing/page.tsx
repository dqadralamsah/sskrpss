import { auth } from '@/lib/auth';
import PurchasingDashboardPage from '../features/dashboard/purchasing/PurchasingDashboardPage';

export default async function PurchasingPage() {
  const session = await auth();

  return (
    <>
      <p>{JSON.stringify(session)}</p>
      <div className="px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Purchasing</h1>
        <PurchasingDashboardPage />
      </div>
    </>
  );
}
