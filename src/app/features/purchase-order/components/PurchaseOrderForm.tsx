'use client';

import { useEffect, useState } from 'react';
import { PurchaseRequestItem } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { PurchaseOrderFormData } from '../types';
import SupplierCombobox from '@/components/ui/comboboxs/SupplierCombobox';
import RawMaterialCombobox from '@/components/ui/comboboxs/RawMaterialCombobox';

type Props = {
  prId?: string | null;
  initialData?: PurchaseOrderFormData;
  onSubmit: (data: PurchaseOrderFormData) => Promise<void>;
  loading: boolean;
};

export default function PurchaseOrderForm({ prId, initialData, onSubmit, loading }: Props) {
  const [supplierId, setSupplierId] = useState(initialData?.supplierId ?? '');
  const [estimatedDate, setEstimatedDate] = useState(initialData?.estimatedDate ?? '');
  const [orderNotes, setOrderNotes] = useState(initialData?.orderNotes ?? '');
  const [items, setItems] = useState(initialData?.items ?? []);

  useEffect(() => {
    if (!prId) return;
    fetch(`/api/purchase-request/${prId}`)
      .then((res) => res.json())
      .then((data) => {
        setSupplierId(data.supplierId);
        setItems(
          data.items.map((item: PurchaseRequestItem) => ({
            rawMaterialId: item.rawMaterial.id,
            quantity: item.quantity,
            unitPrice: 0,
            purchaseRequestItemId: item.id,
          }))
        );
      });
  }, [prId]);

  useEffect(() => {
    if (!initialData) return;

    setSupplierId(initialData.supplierId);
    setEstimatedDate(initialData.estimatedDate);
    setOrderNotes(initialData.orderNotes ?? '');
    setItems(initialData.items);
  }, [initialData]);

  const handleAddItem = () => {
    setItems([...items, { rawMaterialId: '', quantity: 0, unitPrice: 0, minOrder: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = () => {
    const payload: PurchaseOrderFormData = {
      supplierId,
      estimatedDate,
      orderNotes,
      items,
    };
    onSubmit(payload);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Supplier</label>
          <SupplierCombobox value={supplierId} onChange={setSupplierId} />
        </div>
        <div>
          <label className="font-medium">Tanggal Estimasi</label>
          <Input
            type="date"
            value={estimatedDate}
            onChange={(e) => setEstimatedDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="font-medium">Catatan</label>
        <Textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Daftar Item</h3>
          <Button type="button" onClick={handleAddItem} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Tambah Item
          </Button>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm text-muted-foreground">
            <span>Material</span>
            <span>Quantity</span>
            <span>Price</span>
          </div>

          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
              <RawMaterialCombobox
                value={item.rawMaterialId}
                onChange={(val) => {
                  const updated = [...items];
                  updated[i].rawMaterialId = val;
                  setItems(updated);
                }}
              />
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const updated = [...items];
                  updated[i].quantity = Number(e.target.value);
                  setItems(updated);
                }}
                placeholder="Jumlah"
              />
              <Input
                type="number"
                value={item.unitPrice}
                onChange={(e) => {
                  const updated = [...items];
                  updated[i].unitPrice = Number(e.target.value);
                  setItems(updated);
                }}
                placeholder="Harga Satuan"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveItem(i)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Buat PO'}
        </Button>
      </div>
    </div>
  );
}
