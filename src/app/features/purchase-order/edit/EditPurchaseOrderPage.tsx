'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PurchaseOrderForm from '../components/PurchaseOrderForm';
import { PurchaseOrderFormData } from '../types';

export default function EditPurchaseOrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [initialData, setInitialData] = useState<PurchaseOrderFormData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/purchase-order/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const mapped: PurchaseOrderFormData = {
          supplierId: data.supplier.id,
          estimatedDate: data.estimatedDate,
          orderNotes: data.orderNotes,
          items: data.items.map((item: any) => ({
            rawMaterialId: item.rawMaterial.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            minOrder: item.minOrder,
          })),
        };
        setInitialData(mapped);
      });
  }, [id]);

  const handleUpdate = async (data: PurchaseOrderFormData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/purchase-order/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Update failed');

      router.push('/admin/purchase-order');
    } catch (err) {
      console.error('[UPDATE_PO]', err);
      alert('Gagal memperbarui PO');
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) return <div>Loading...</div>;

  return <PurchaseOrderForm initialData={initialData} onSubmit={handleUpdate} loading={loading} />;
}
