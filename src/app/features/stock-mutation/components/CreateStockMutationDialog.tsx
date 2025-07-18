'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StockMutationFormData } from '@/types/stock-mutation';
import StockMutationForm from '../components/StockMutationForm';

type Props = {
  rawMaterialId: string;
  open: boolean;
  onOpenChange: (val: boolean) => void;
};

export default function CreateMutationDialog({ rawMaterialId, open, onOpenChange }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: StockMutationFormData) => {
    setLoading(true);
    try {
      await fetch('/api/stock-mutation', {
        method: 'POST',
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
          <DialogTitle>Tambah Mutasi Stok</DialogTitle>
        </DialogHeader>
        <StockMutationForm
          rawMaterialId={rawMaterialId}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
