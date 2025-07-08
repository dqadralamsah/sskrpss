'use client';

import { useState } from 'react';
import { Supplier } from './type';
import { Button } from '@/components/ui/button';
import SupplierTable from './components/SupplierTable';
import FilterBar from './components/FilterBar';
import SupplierDialog from './components/SupplierDialog';
import SupplierDetailDialog from './components/SupplierDetailDialog';

export default function SupplierPage() {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [viewing, setViewing] = useState<Supplier | null>(null);

  const handleAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditing(supplier);
    setDialogOpen(true);
  };

  const handleView = (supplier: Supplier) => {
    setViewing(supplier);
    setDetailOpen(true);
  };

  return (
    <div className="max-w-screen-xl space-y-6">
      <div className="flex justify-between items-center">
        <FilterBar value={search} onChange={setSearch} />
        <Button onClick={handleAdd}>+ Add Supplier</Button>
      </div>

      <SupplierTable search={search} onEdit={handleEdit} onView={handleView} />

      <SupplierDialog open={dialogOpen} onClose={() => setDialogOpen(false)} supplier={editing} />

      <SupplierDetailDialog open={detailOpen} onOpenChange={setDetailOpen} supplier={viewing} />
    </div>
  );
}
