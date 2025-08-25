import { AdminDashboard } from '../features/dashboard/admin/AdminDashboardPage';

export default async function AdminPage() {
  // const session = await auth();

  return (
    <div className="px-6 py-8 space-y-6 ">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}
