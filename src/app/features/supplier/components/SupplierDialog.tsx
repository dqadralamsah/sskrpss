'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SupplierForm from './SupplierForm';
import { Supplier } from '../type';

type Props = {
  open: boolean;
  onClose: () => void;
  supplier: Supplier | null;
};

export default function SupplierDialog({ open, onClose, supplier }: Props) {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{supplier ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
        </DialogHeader>
        <SupplierForm supplier={supplier} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
