'use client';

import Link from 'next/link';
import { RawMaterial } from '@/types/raw-material';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

type Props = {
  data: RawMaterial[];
  loading: boolean;
};

type StockStatus = 'LOW' | 'MID' | 'GOOD' | 'OVER';

function getStockStatus(material: RawMaterial): StockStatus {
  const { stock, minStock, maxStock, safetyStock } = material;
  if (stock < safetyStock) return 'LOW';
  if (stock < minStock) return 'MID';
  if (stock <= maxStock) return 'GOOD';
  return 'OVER';
}

function getStatusColor(status: StockStatus) {
  switch (status) {
    case 'LOW':
      return 'bg-red-100 text-red-700';
    case 'MID':
      return 'bg-yellow-100 text-yellow-700';
    case 'GOOD':
      return 'bg-green-100 text-green-700';
    case 'OVER':
      return 'bg-orange-100 text-orange-700';
  }
}

export default function RawMaterialTable({ data, loading }: Props) {
  return (
    <div className="border rounded-lg overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="w-28 p-3 text-start">ID Material</th>
            <th className="p-3 text-start">Name</th>
            <th className="w-24 p-3 text-center">Stock</th>
            <th className="w-24 p-3 text-center">Unit</th>
            <th className="w-24 p-3 text-center">Status</th>
            <th className="w-24 p-3 text-center">Actions</th>
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
                Data Kosong.
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const status = getStockStatus(item);
              const statusColor = getStatusColor(status);
              return (
                <tr
                  key={item.id}
                  className="border-tborder-t border-muted hover:bg-muted/60 even:bg-muted/40"
                >
                  <td className="p-3 font-mono text-xs text-muted-foreground text-start">
                    {item.id}
                  </td>
                  <td className="p-3 text-start">{item.name}</td>
                  <td className="p-3 text-center">{item.stock}</td>
                  <td className="p-3 text-center">{item.unit}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {status}
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
                          <Link href={`/admin/inventory/${item.id}`}>Lihat</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/inventory/${item.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
