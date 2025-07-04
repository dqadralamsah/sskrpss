import PurchaeRequestPage from '@/app/features/purchase-request/PurchaseRequestPage';

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Purchase Requests</h1>
      <PurchaeRequestPage />;
    </div>
  );
}
