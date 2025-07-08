'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { PurchaseRequest } from '../type';

type Props = {
  requests: PurchaseRequest[];
  onView: (req: PurchaseRequest) => void;
  onDelete: (id: string) => void;
  onPrint: (req: PurchaseRequest) => void;
};

export default function TablePurhcaseRequest({ requests, onView, onDelete, onPrint }: Props) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-center">
              <input type="checkbox" />
            </th>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Requester</th>
            <th className="p-3 text-left">Approved By</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Date</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-t border-muted hover:bg-muted/60 even:bg-muted/40">
              <td className="p-3 text-center">
                <input type="checkbox" />
              </td>
              <td className="p-3 font-mono text-xs text-muted-foreground">{req.id.slice(0, 9)}</td>
              <td className="p-3">{req.requestedBy.name}</td>
              <td className="p-3">{req.approvedBy?.name || '-'}</td>
              <td className="p-3 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    req.status === 'APPROVED'
                      ? 'bg-green-100 text-green-700'
                      : req.status === 'REJECTED'
                      ? 'bg-red-100 text-red-700'
                      : req.status === 'REVISION'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {req.status}
                </span>
              </td>
              <td className="p-3 text-center">{new Date(req.requestDate).toLocaleDateString()}</td>
              <td className="p-3 text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-muted rounded">
                      <MoreVertical size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onView(req)}>Lihat</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPrint(req)}>Print</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:bg-red-50"
                      onClick={() => onDelete(req.id)}
                    >
                      Hapus
                    </DropdownMenuItem>
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
