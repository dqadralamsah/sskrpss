'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RawMaterial, PurchaseRequest } from '../type';
import ItemInputList from './ItemInputList';

type Props = {
  rawMaterials: RawMaterial[];
  onSuccess: (newRequest: PurchaseRequest) => void;
  initialData?: PurchaseRequest | null;
  onClose?: () => void;
};

export default function CreateDialog({ rawMaterials, onSuccess, initialData, onClose }: Props) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<
    Array<{ rawMaterialId: string; quantity: number; unit: string }>
  >([]);
  const isRevision = !!initialData;

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || '');
      setItems(
        initialData.items.map((item) => ({
          rawMaterialId: item.rawMaterial.id,
          quantity: item.quantity,
          unit: item.unit || '',
        }))
      );
      setOpen(true);
    }
  }, [initialData]);

  const addItem = () => {
    setItems((prev) => [...prev, { rawMaterialId: '', quantity: 1, unit: '' }]);
  };

  const updateItem = (
    index: number,
    key: 'rawMaterialId' | 'quantity' | 'unit',
    value: string | number
  ) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const handleSubmit = async () => {
    const isValid = items.every((item) => item.rawMaterialId && item.quantity > 0);
    if (!isValid) return alert('Isi semua item dengan benar');

    const payload = { description, items };
    const res = await fetch(
      isRevision ? `/api/purchase-request/revise/${initialData.id}` : '/api/purchase-request/user',
      {
        method: isRevision ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) return alert('Gagal submit');
    const result = await res.json();
    onSuccess(result);

    setOpen(false);
    setDescription('');
    setItems([]);
    if (onClose) onClose();
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="w-full flex items-center justify-end">
        <Button
          onClick={() => {
            setItems([]);
            setOpen(true);
          }}
        >
          + Ajukan Barang
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Buat Pengajuan</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <ItemInputList
              items={items}
              updateItem={updateItem}
              addItem={addItem}
              rawMaterials={rawMaterials}
              removeItem={removeItem}
            />

            <div className="flex justify-end">
              <Button onClick={handleSubmit}>Ajukan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
