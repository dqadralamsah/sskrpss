// src/app/admin/purchase-order/components/PurchaseRequestReady.tsx

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ApprovedPurchaseRequest } from '../types';

export default function PurcahseRequestApproveTable() {
  const [data, setData] = useState<ApprovedPurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/purchase-request/prapproved')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="border rounded-lg overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-3">PR ID</th>
            <th className="p-3">Request By</th>
            <th className="p-3">Approved By</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Date</th>
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
            data.map((pr) => (
              <tr key={pr.id} className="border-t border-muted hover:bg-muted/60 even:bg-muted/40">
                <td className="p-3">{pr.id}</td>
                <td className="p-3">{pr.requestedBy.name}</td>
                <td className="p-3">{pr.approvedBy.name}</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-1 rounded-full text-xs font-medium text-green-700 bg-green-100">
                    {pr.status}
                  </span>
                </td>
                <td className="p-3 text-center">{new Date(pr.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-center">
                  <Link href={`/admin/purchase-order/create?pr=${pr.id}`}>
                    <button className="p-1 hover:bg-muted rounded">+ Create</button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
