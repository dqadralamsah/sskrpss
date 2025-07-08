'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Supplier, RawMaterial, PurchaseRequestItem } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { SupplierCombobox, RawMaterialCombobox } from './comboboxs'; // ✅ sesuai lokasi kamu

type Props = {
  prId?: string | null;
};

export function CreateOrderForm({ prId }: Props) {
  const router = useRouter();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data awal
  useEffect(() => {
    const fetchData = async () => {
      const [supplierRes, materialRes] = await Promise.all([
        fetch('/api/supplier').then((res) => res.json()),
        fetch('/api/raw-material').then((res) => res.json()),
      ]);
      setSuppliers(supplierRes);
      setRawMaterials(materialRes);
    };

    fetchData();
  }, []);

  // Auto-fill dari PR jika ada
  useEffect(() => {
    if (!prId) return;

    const fetchPR = async () => {
      const res = await fetch(`/api/purchase-request/${prId}`);
      const data = await res.json();

      setSupplierId(data.supplierId);
      const mappedItems = data.items.map((item: PurchaseRequestItem) => ({
        rawMaterialId: item.rawMaterial.id,
        quantity: item.quantity,
        unitPrice: '',
        purchaseRequestItemId: item.id,
      }));

      setItems(mappedItems);
    };

    fetchPR();
  }, [prId]);

  const handleAddItem = () => {
    setItems([...items, { rawMaterialId: '', quantity: 0, unitPrice: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/purchase-order', {
        method: 'POST',
        body: JSON.stringify({
          supplierId,
          orderNotes,
          items: items.filter((item) => item.rawMaterialId),
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to create PO');

      router.push('/admin/purchase-order');
    } catch (err) {
      console.error(err);
      alert('Gagal membuat PO');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Supplier & OrderNotes */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="font-medium">Supplier</label>
          <SupplierCombobox suppliers={suppliers} value={supplierId} onChange={setSupplierId} />
        </div>
        <div>
          <label className="font-medium">Catatan</label>
          <Textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} />
        </div>
      </div>

      {/*  */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Daftar Item</h3>
          <Button type="button" onClick={handleAddItem} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Tambah Item
          </Button>
        </div>

        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <RawMaterialCombobox
              rawMaterials={rawMaterials}
              value={item.rawMaterialId}
              onChange={(value) => {
                const updated = [...items];
                updated[i].rawMaterialId = value;
                setItems(updated);
              }}
            />

            <Input
              type="number"
              placeholder="Jumlah"
              value={item.quantity}
              onChange={(e) => {
                const updated = [...items];
                updated[i].quantity = Number(e.target.value);
                setItems(updated);
              }}
            />
            <Input
              type="number"
              placeholder="Harga Satuan"
              value={item.unitPrice}
              onChange={(e) => {
                const updated = [...items];
                updated[i].unitPrice = e.target.value;
                setItems(updated);
              }}
            />
            <div className="col-span-1">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveItem(i)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex item-center justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Menyimpan...' : 'Create PO'}
        </Button>
      </div>
    </div>
  );
}
