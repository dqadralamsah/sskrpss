'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import StockMutationTable from './components/StockMutationTable';
import CreateMutationDialog from './components/CreateStockMutationDialog';
import PaginationBar from '@/components/ui/Pagination/PaginationBar';

type Props = {
  rawMaterialId: string;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function StockMutationPage({ rawMaterialId, setRefreshTrigger }: Props) {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold mb-2">Mutasi</h2>
        <Button onClick={() => setOpenCreateDialog(true)}>Tambah Mutasi</Button>
      </div>

      <StockMutationTable
        rawMaterialId={rawMaterialId}
        page={page}
        limit={limit}
        shouldRefetch={shouldRefetch}
        onRefetched={() => setShouldRefetch(false)}
        onTotalPagesChange={setTotalPages}
        setRefreshTrigger={setRefreshTrigger}
      />

      <PaginationBar currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <CreateMutationDialog
        rawMaterialId={rawMaterialId}
        open={openCreateDialog}
        onOpenChange={(open) => {
          setOpenCreateDialog(open);
          if (!open) {
            setShouldRefetch(true);
            setRefreshTrigger(true);
          }
        }}
      />
    </div>
  );
}
