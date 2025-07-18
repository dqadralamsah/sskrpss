import InventoryPage from '@/app/features/inventory/InventoryPage';

export default function Page() {
  return (
    <div className="px-6 py-8 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
      <InventoryPage />
    </div>
  );
}
