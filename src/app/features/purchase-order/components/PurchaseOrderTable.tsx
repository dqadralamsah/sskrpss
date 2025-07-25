'use client';

import { useEffect, useState } from 'react';
import { PurchaseOrder } from '../types';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PurchaseOrderTable() {
  const [data, setData] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/purchase-order')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Yakin hapus PO ini?');
    if (!confirm) return;

    const res = await fetch(`/api/purchase-order/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setData((prev) => prev.filter((po) => po.id !== id));
    } else {
      alert('Gagal menghapus PO');
    }
  };

  const statusClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-blue-100 text-blue-700';
      case 'DELIVERY':
        return 'bg-yellow-100 text-yellow-700';
      case 'RECEIVED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'PARTIAL':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="rounded-lg border overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-start">PO Id</th>
            <th className="p-3 text-start">Supplier</th>
            <th className="p-3 text-start">Order By</th>
            <th className="p-3 text-center">Date</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Action</th>
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
              <td colSpan={6} className="p-3 border-t text-center ">
                Tidak ada Purchase Order.
              </td>
            </tr>
          ) : (
            data.map((po) => (
              <tr key={po.id} className="border-t border-muted hover:bg-muted/60 even:bg-muted/40">
                <td className="p-3 font-mono text-xs text-muted-foreground">{po.id}</td>
                <td className="p-3">{po.supplier.name}</td>
                <td className="p-3">{po.createdBy.name}</td>
                <td className="p-3 text-center">{new Date(po.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(
                      po.status
                    )}`}
                  >
                    {po.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-muted rounded">
                        <MoreVertical size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/purchase-order/${po.id}`}>Lihat</Link>
                      </DropdownMenuItem>
                      {po.status === 'PENDING' && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/purchase-order/${po.id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(po.id)}>
                            Hapus
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
