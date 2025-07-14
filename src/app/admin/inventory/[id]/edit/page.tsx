import EditInventoryPage from '@/app/features/inventory/edit/EditInventoryPage';

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Create New Item</h1>
      <EditInventoryPage />;
    </div>
  );
}
