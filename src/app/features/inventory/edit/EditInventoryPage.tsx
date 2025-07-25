'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RawMaterialFormData } from '@/types/raw-material';
import RawMaterialForm from '../components/RawMaterialForm';

export default function EditInventoryPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [initialData, setInitialData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`/api/raw-material/${id}`)
      .then((res) => res.json())
      .then((material) => {
        const formatted: RawMaterialFormData = {
          name: material.name,
          description: material.description,
          unit: material.unit,
          minStock: material.minStock,
          maxStock: material.maxStock,
          safetyStock: material.safetyStock,
          suppliers: (material.suppliers ?? []).map((s: any) => ({
            supplierId: s.id,
            price: s.price,
            minOrder: s.minOrder,
          })),
        };

        setInitialData(formatted);
      })
      .catch((error) => {
        console.error('[FETCH_EDIT_RAW_MATERIAL]', error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data: RawMaterialFormData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/raw-material/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update');

      alert('Raw Material successfully updated');
      router.push('/admin/inventory');
    } catch (error) {
      console.error('[UPDATE_RAW_MATERIAL]', error);
      alert('Failed to update raw materials');
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <div>
      {/* RawMaterial Section */}
      <RawMaterialForm onSubmit={handleUpdate} loading={loading} initialData={initialData} />
    </div>
  );
}
