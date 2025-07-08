'use client';

import { useSearchParams } from 'next/navigation';
import { CreateOrderForm } from './components/CreateOrderForm';

export default function CreatePurchaseOrderPage() {
  const searchParams = useSearchParams();
  const prId = searchParams.get('pr');

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Create Purchase Order</h2>
      <CreateOrderForm prId={prId} />
    </div>
  );
}
