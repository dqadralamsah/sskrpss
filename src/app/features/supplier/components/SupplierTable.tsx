'use client';

import { useEffect, useState } from 'react';
import { Supplier } from '../type';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

type Props = {
  search: string;
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
};

export default function SupplierTable({ search, onView, onEdit }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    fetch('/api/supplier')
      .then((res) => res.json())
      .then((data) => setSuppliers(data));
  }, []);

  const filtered = suppliers.filter((s) => s.name.includes(search));

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.id} className="border-t border-muted hover:bg-muted/60 even:bg-muted/40">
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.email || '-'}</td>
              <td className="p-3">{s.phone || '-'}</td>
              <td className="p-3 text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-muted rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    <DropdownMenuItem onClick={() => onView(s)}>Lihat</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(s)}>Edit</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
