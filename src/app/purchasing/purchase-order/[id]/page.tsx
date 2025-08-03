import DetailPurchaseOrderPage from '@/app/features/purchase-order/detail/DetailPurchaseOrderPage';

export default function Page() {
  return (
    <div className="px-6 py-8 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Detail Order</h1>
      <DetailPurchaseOrderPage />
    </div>
  );
}
