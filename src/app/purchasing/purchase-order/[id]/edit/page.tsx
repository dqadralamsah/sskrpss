import EditPurchaseOrderPage from '@/app/features/purchase-order/edit/EditPurchaseOrderPage';

export default function Page() {
  return (
    <div className="px-6 py-8 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Edit Purcahse Order</h1>
      <EditPurchaseOrderPage />
    </div>
  );
}
