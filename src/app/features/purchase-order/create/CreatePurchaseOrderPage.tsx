'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { PurchaseOrderFormData } from '../types';
import PurchaseOrderForm from '../components/PurchaseOrderForm';

export default function CreatePurchaseOrderPage() {
  const searchParams = useSearchParams();
  const prId = searchParams.get('pr');
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: PurchaseOrderFormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/purchase-order', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Create failed');

      router.push('/admin/purchase-order');
    } catch (err) {
      console.error('[CREATE_PO]', err);
      alert('Gagal membuat PO');
    } finally {
      setLoading(false);
    }
  };

  return <PurchaseOrderForm prId={prId} onSubmit={handleCreate} loading={loading} />;
}
