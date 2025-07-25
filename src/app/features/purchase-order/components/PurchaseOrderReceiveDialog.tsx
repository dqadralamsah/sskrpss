'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { PurchaseOrderItemDetail } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  purchaseOrderId: string;
  items: PurchaseOrderItemDetail[];
  onSuccess: () => void;
  currentUserId: string;
};

type ReceiveItem = {
  itemId: string;
  receivedQty: number;
};

export default function PurchaseOrderReceiveDialog({
  open,
  onClose,
  purchaseOrderId,
  items,
  currentUserId,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<ReceiveItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        items.map((item) => ({
          itemId: item.id,
          receivedQty: 0,
        }))
      );
    }
  }, [open, items]);

  const handleChange = (index: number, value: number) => {
    const updated = [...form];
    updated[index].receivedQty = value;
    setForm(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/purchase-order/${purchaseOrderId}/receive`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: form,
          receivedById: currentUserId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert(data.message || 'Failed to receive PO');
      }
    } catch (err) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Receive Purchase Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center border p-3 rounded-xl"
            >
              <div className="text-sm font-medium">
                {item.rawMaterial?.name}
                <div className="text-xs text-muted-foreground">
                  Ordered: {item.quantity} | Received: {item.receivedQty}
                </div>
              </div>
              <Input
                type="number"
                min={0}
                value={form[index]?.receivedQty || 0}
                onChange={(e) => handleChange(index, Number(e.target.value))}
                placeholder="Enter received quantity"
              />
            </div>
          ))}

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Receiving...' : 'Confirm Receive'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
