'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Supplier } from '../type';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
};

export default function SupplierDetailDialog({ open, onOpenChange, supplier }: Props) {
  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Supplier Detail</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div>
            <p>
              <strong>Name:</strong> {supplier.name}
            </p>
            <p>
              <strong>Email:</strong> {supplier.email || '-'}
            </p>
            <p>
              <strong>Phone:</strong> {supplier.phone || '-'}
            </p>
          </div>

          <div>
            <p className="font-medium mb-2">Supplied Materials</p>
            <table className="w-full text-sm border">
              <thead>
                <tr>
                  <th className="p-2 text-left">Material</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Min Order</th>
                </tr>
              </thead>
              <tbody>
                {supplier.materials.map((rel) => (
                  <tr key={rel.rawMaterialId} className="border-t">
                    <td className="p-2">{rel.rawMaterial.name}</td>
                    <td className="p-2 text-right">Rp{Number(rel.price).toLocaleString()}</td>
                    <td className="p-2 text-right">{rel.minOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
