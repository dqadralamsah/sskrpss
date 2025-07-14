import DetailInventoryPage from '@/app/features/inventory/detail/DetailInventoryPage';

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Item Details</h1>
      <DetailInventoryPage />
    </div>
  );
}
