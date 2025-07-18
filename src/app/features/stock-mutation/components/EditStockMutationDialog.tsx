'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StockMutationForm from '../components/StockMutationForm';
import { StockMutationFormData } from '@/types/stock-mutation';

type Props = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  mutationId: string;
  initialData: StockMutationFormData;
};

export default function EditMutationDialog({ open, onOpenChange, mutationId, initialData }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: StockMutationFormData) => {
    setLoading(true);
    try {
      await fetch(`/api/stock-mutation/${mutationId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Mutasi Stok</DialogTitle>
        </DialogHeader>
        <StockMutationForm
          rawMaterialId={initialData.rawMaterialId}
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
