'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PurchaseOrderTable from './components/PurchaseOrderTable';
import PurchaseRequestApprovedTable from './components/PurchaseRequestApprovedTable';

export default function PurchaseOrderPage() {
  const [view, setView] = useState<'po' | 'pr'>('po');

  return (
    <div className="space-y-4">
      {/* Navigasi tombol */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant={view === 'po' ? 'default' : 'outline'} onClick={() => setView('po')}>
            Daftar PO
          </Button>
          <Button variant={view === 'pr' ? 'default' : 'outline'} onClick={() => setView('pr')}>
            PR Siap PO
          </Button>
        </div>

        {/* Tombol Buat PO Manual */}
        <Link href="/admin/purchase-order/create">
          <Button>+ Buat PO</Button>
        </Link>
      </div>

      {/* Konten berdasarkan toggle */}
      {view === 'po' && <PurchaseOrderTable />}
      {view === 'pr' && <PurchaseRequestApprovedTable />}
    </div>
  );
}
