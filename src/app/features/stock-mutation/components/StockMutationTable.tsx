'use client';

import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreVertical } from 'lucide-react';
import { StockMutation } from '@/types/stock-mutation';
import EditMutationDialog from './EditStockMutationDialog';

type Props = {
  rawMaterialId: string;
  shouldRefetch: boolean;
  onRefetched: () => void;
  page: number;
  limit: number;
  onTotalPagesChange: (val: number) => void;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

function getTypeColor(type: string) {
  switch (type) {
    case 'IN':
      return 'bg-green-100 text-green-700';
    case 'OUT':
      return 'bg-red-100 text-red-700';
    default:
      return '';
  }
}

export default function StockMutationTable({
  rawMaterialId,
  shouldRefetch,
  onRefetched,
  page,
  limit,
  onTotalPagesChange,
  setRefreshTrigger,
}: Props) {
  const [data, setData] = useState<StockMutation[]>([]);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingData, setEditingData] = useState<StockMutation | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/stock-mutation?rawMaterialId=${rawMaterialId}&page=${page}&limit=${limit}`
      );
      if (!res.ok) throw new Error('Failed to GET data');

      const json = await res.json();
      setData(json.data || []);
      onTotalPagesChange(json.totalPages || 0);
    } catch (error) {
      console.error('[FETCH_STOCK_MUTATION]', error);
      alert('Failed to GET data');
    } finally {
      setLoading(false);
      onRefetched();
    }
  };

  useEffect(() => {
    if (!rawMaterialId) return;
    fetchData();
  }, [rawMaterialId, page, limit]);

  useEffect(() => {
    if (shouldRefetch) {
      fetchData().then(() => {
        onRefetched();
      });
    }
  }, [shouldRefetch]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Yakin ingin menghapus mutasi ini?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/stock-mutation/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete mutation');

      fetchData();
      setRefreshTrigger(true);
    } catch (err) {
      console.error('[DELETE_ERROR]', err);
      alert('Failed to delete mutation');
    }
  };

  const handleEdit = (mutation: StockMutation) => {
    setEditingData(mutation);
    setOpenDialog(true);
  };

  return (
    <div className="border rounded-lg overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-muted">
          <tr>
            <th className="p-3">Tanggal</th>
            <th className="p-3 text-center">Tipe</th>
            <th className="p-3 text-center">Sumber</th>
            <th className="p-3 text-center">Jumlah</th>
            <th className="p-3">Keterangan</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-t">
                {Array.from({ length: 6 }).map((__, j) => (
                  <td key={j} className="px-4 py-2">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-3 border-t text-center">
                Tidak ada Mutasi.
              </td>
            </tr>
          ) : (
            data.map((mutation) => (
              <tr
                key={mutation.id}
                className="border-t border-muted hover:bg-muted/60 even:bg-muted/40"
              >
                <td className="p-3">{new Date(mutation.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                      mutation.type
                    )}`}
                  >
                    {mutation.type}
                  </span>
                </td>
                <td className="p-3 text-center">{mutation.sourceType}</td>
                <td className="p-3 text-center">{mutation.quantity}</td>
                <td className="p-3">{mutation.description || '-'}</td>
                <td className="p-3 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-muted rounded">
                        <MoreVertical size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      <DropdownMenuItem onClick={() => handleEdit(mutation)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(mutation.id)}>
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Dialog Edit */}
      {editingData && (
        <EditMutationDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          mutationId={editingData.id}
          initialData={{
            rawMaterialId: editingData.rawMaterialId,
            type: editingData.type,
            sourceType: editingData.sourceType,
            quantity: editingData.quantity,
            description: editingData.description || '',
          }}
        />
      )}
    </div>
  );
}
