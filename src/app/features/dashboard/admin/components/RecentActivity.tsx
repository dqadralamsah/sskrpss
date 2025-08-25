'use client';

import { Card, CardContent } from '@/components/ui/card';

type RecentItem =
  | {
      type: 'PR';
      id: string;
      status: string;
      requestedBy?: string;
      approvedBy?: string;
      date: string;
    }
  | {
      type: 'PO';
      id: string;
      status: string;
      createdBy?: string;
      supplier?: string;
      date: string;
    }
  | {
      type: 'MUTATION';
      id: string;
      mutationType: string;
      material: string;
      qty: number;
      user?: string;
      date: string;
    };

type Props = {
  data: RecentItem[];
};

const statusColors: Record<string, string> = {
  SUBMITTED: 'bg-yellow-200 text-yellow-800',
  REVISION: 'bg-blue-200 text-blue-800',
  REJECTED: 'bg-red-200 text-red-800',
  APPROVED: 'bg-green-200 text-green-800',
  PENDING: 'bg-yellow-200 text-yellow-800',
  DELIVERY: 'bg-blue-200 text-blue-800',
  RECEIVED: 'bg-green-200 text-green-800',
  CANCELLED: 'bg-red-200 text-red-800',
};

export function RecentActivity({ data }: Props) {
  const prs = data.filter((item) => item.type === 'PR');
  const pos = data.filter((item) => item.type === 'PO');
  const mutations = data.filter((item) => item.type === 'MUTATION');

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="space-y-6">
      {/* Purchase Requests Table */}
      {prs.length > 0 && (
        <Card className="bg-white shadow-md rounded-xl">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Purchase Requests</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Requested By</th>
                    <th className="px-3 py-2">Approved By</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prs.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{formatDate(item.date)}</td>
                      <td className="px-3 py-2">{item.requestedBy || '-'}</td>
                      <td className="px-3 py-2">{item.approvedBy || '-'}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            statusColors[item.status] || 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Purchase Orders Table */}
      {pos.length > 0 && (
        <Card className="bg-white shadow-md rounded-xl">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Purchase Orders</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Created By</th>
                    <th className="px-3 py-2">Supplier</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pos.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{formatDate(item.date)}</td>
                      <td className="px-3 py-2">{item.createdBy || '-'}</td>
                      <td className="px-3 py-2">{item.supplier || '-'}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            statusColors[item.status] || 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Mutations Table */}
      {mutations.length > 0 && (
        <Card className="bg-white shadow-md rounded-xl">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Stock Mutations</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Mutation Type</th>
                    <th className="px-3 py-2">Material</th>
                    <th className="px-3 py-2">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {mutations.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{formatDate(item.date)}</td>
                      <td className="px-3 py-2">{item.user || '-'}</td>
                      <td className="px-3 py-2 font-semibold">{item.mutationType}</td>
                      <td className="px-3 py-2">{item.material}</td>
                      <td className="px-3 py-2">{item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
