import InventoryPage from '@/app/features/inventory/InventoryPage';

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
      <InventoryPage />
    </div>
  );
}
