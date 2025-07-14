'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RawMaterialDetail } from '@/types/raw-material';

export default function DetailInventoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<RawMaterialDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/raw-material/${id}`);
        if (!res.ok) throw new Error('Gagal mengambil data bahan baku');

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('[DETAIL_FETCH_ERROR]', error);
        alert('Gagal memuat data bahan baku');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="text-sm text-muted-foreground">Memuat data...</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Data tidak ditemukan.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Detail Bahan Baku</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p>
            <span className="font-medium">ID:</span> {data.id}
          </p>
          <p>
            <span className="font-medium">Nama:</span> {data.name}
          </p>
          <p>
            <span className="font-medium">Deskripsi:</span> {data.description || '-'}
          </p>
          <p>
            <span className="font-medium">Stock:</span> {data.stock}
          </p>
          <p>
            <span className="font-medium">Satuan:</span> {data.unit}
          </p>
        </div>

        <div>
          <p>
            <span className="font-medium">Min Stock:</span> {data.minStock}
          </p>
          <p>
            <span className="font-medium">Max Stock:</span> {data.maxStock}
          </p>
          <p>
            <span className="font-medium">Safety Stock:</span> {data.safetyStock}
          </p>
          <div className="mt-2">
            <span className="font-medium">Supplier:</span>
            {data?.suppliers?.length ? (
              <ul className="list-disc list-inside mt-1">
                {data.suppliers.map((s) => (
                  <li key={s.id}>
                    {s.name} - Rp{s.price.toLocaleString('id-ID')} (Min Order: {s.minOrder})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground italic">Belum ada supplier.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={() => router.push('/api/inventory')}>
          Kembali
        </Button>
        <Button onClick={() => router.push(`/admin/inventory/${data.id}/edit`)}>Edit</Button>
      </div>
    </div>
  );
}
