'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Supplier } from '@/types/supplier';
import { RawMaterialFormData } from '@/types/raw-material';
import RawMaterialForm from '../components/RawMaterialForm';

export default function CreateInventoryPage() {
  const router = useRouter();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/supplier`)
      .then((res) => res.json())
      .then((data) => setSuppliers(data))
      .catch((err) => console.error('Failed to fecth data supplier', err));
  });

  const handleCreate = async (data: RawMaterialFormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/raw-material', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to Create');

      alert('Raw Material successfully created');
      router.push('/admin/inventory');
    } catch (error) {
      console.error('[CREATE_RAW_MATERIAL]', error);
      alert('Failed to create raw materials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <RawMaterialForm onSubmit={handleCreate} loading={loading} suppliers={suppliers} />
    </div>
  );
}
