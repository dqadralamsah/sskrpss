'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RawMaterialDetail } from '@/types/raw-material';
import StockMutationPage from '@/app/features/stock-mutation/StockMutationPage';

export default function DetailInventoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<RawMaterialDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

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
  }, [id, refreshTrigger]);

  if (loading) return <p className="text-sm text-muted-foreground">Memuat data...</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Data tidak ditemukan.</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-md">
        <div className="space-y-2">
          <p>
            <span className="font-medium">ID:</span> {data.id}
          </p>
          <p>
            <span className="font-medium">Nama:</span> {data.name}
          </p>
          <p>
            <span className="font-medium">Deskripsi:</span> {data.description || '-'}
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <span className="font-medium">Stock:</span> {data.stock}
          </p>
          <p>
            <span className="font-medium">Satuan:</span> {data.unit}
          </p>
          <p>
            <span className="font-medium">Min Stock:</span> {data.minStock}
          </p>
          <p>
            <span className="font-medium">Max Stock:</span> {data.maxStock}
          </p>
          <p>
            <span className="font-medium">Safety Stock:</span> {data.safetyStock}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Supplier</h2>
        {data.suppliers?.length ? (
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Harga</th>
                  <th className="p-3">Min Order</th>
                </tr>
              </thead>
              <tbody>
                {data.suppliers.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-muted hover:bg-muted/60 even:bg-muted/40"
                  >
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">Rp{s.price.toLocaleString('id-ID')}</td>
                    <td className="p-3">{s.minOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground italic">Belum ada supplier.</p>
        )}
      </div>

      <StockMutationPage rawMaterialId={data.id} setRefreshTrigger={setRefreshTrigger} />

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => router.push('/admin/inventory')}>
          Kembali
        </Button>
        <Button onClick={() => router.push(`/admin/inventory/${data.id}/edit`)}>Edit</Button>
      </div>
    </div>
  );
}
