'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

type RawMaterial = {
  id: string;
  name: string;
};

type PurchaseRequestItem = {
  id: string;
  quantity: number;
  rawMaterial: RawMaterial;
};

type PurchaseRequest = {
  id: string;
  description: string | null;
  status: string;
  items: PurchaseRequestItem[];
};

export default function CreateRequestPage() {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<Array<{ rawMaterialId: string; quantity: number }>>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [userRequests, setUserRequests] = useState<PurchaseRequest[]>([]);

  useEffect(() => {
    fetch('/api/raw-material')
      .then((res) => res.json())
      .then(setRawMaterials);
  }, []);

  useEffect(() => {
    fetch('/api/purchase-request/user')
      .then((res) => res.json())
      .then(setUserRequests);
  }, []);

  const addItem = () => {
    setItems((prev) => [...prev, { rawMaterialId: '', quantity: 1 }]);
  };

  const updateItem = (index: number, key: 'rawMaterialId' | 'quantity', value: string | number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const handleSubmit = async () => {
    const isValid = items.every((item) => item.rawMaterialId && item.quantity > 0);
    if (!isValid) {
      alert('Semua item harus memiliki material dan jumlah minimal 1');
      return;
    }

    try {
      const res = await fetch('/api/purchase-request/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, items }),
      });

      if (!res.ok) throw new Error('Failed to submit');

      const newPR: PurchaseRequest = await res.json();
      setUserRequests((prev) => [newPR, ...prev]);
      setDescription('');
      setItems([]);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert('Gagal mengajukan request');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Purchase Request</h1>
        <Button onClick={() => setOpen(true)}>+ Tambah Barang</Button>
      </div>

      {/* Modal Input PR */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajukan Barang</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Deskripsi (opsional)</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Select
                    value={item.rawMaterialId}
                    onValueChange={(val) => updateItem(index, 'rawMaterialId', val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Material" />
                    </SelectTrigger>
                    <SelectContent>
                      {rawMaterials.map((rm) => (
                        <SelectItem key={rm.id} value={rm.id}>
                          {rm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    min={1}
                    className="w-24"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                  />
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={addItem}>
                + Tambah Item
              </Button>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSubmit}>Ajukan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tabel Daftar Barang */}
      <div>
        <h2 className="font-semibold mb-2">Daftar Barang yang Diajukan</h2>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Item</th>
              <th className="p-2">Description</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {userRequests.flatMap((pr) =>
              pr.items.map((item, idx) => (
                <tr key={`${pr.id}-${idx}`} className="border-t">
                  <td className="p-2">{item.rawMaterial.name}</td>
                  <td className="p-2">{pr.description || '-'}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{pr.status}</td>
                </tr>
              ))
            )}
            {userRequests.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  Belum ada barang diajukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
