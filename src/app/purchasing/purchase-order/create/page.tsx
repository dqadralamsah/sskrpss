import CreatePurchaseOrderPage from '@/app/features/purchase-order/create/CreatePurchaseOrderPage';

export default function Page() {
  return (
    <div className="px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Purchase Order</h1>
      <CreatePurchaseOrderPage />
    </div>
  );
}
