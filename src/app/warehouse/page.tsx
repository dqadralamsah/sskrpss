import WarehouseDashboard from '../features/dashboard/warehouse/WarehouseDashboardPage';

export default async function WarehousePage() {
  return (
    <>
      <div className="px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Purchasing</h1>
        <WarehouseDashboard />
      </div>
    </>
  );
}
