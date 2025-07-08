import PurchaseOrderPage from '@/app/features/purchase-order/PurchaseOrderPage';

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Purchase Order</h1>
      <PurchaseOrderPage />
    </div>
  );
}
