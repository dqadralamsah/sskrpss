import CreateOrderPage from '@/app/features/purchase-order/CreateOrderPage';

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Purchase Order</h1>
      <CreateOrderPage />
    </div>
  );
}
