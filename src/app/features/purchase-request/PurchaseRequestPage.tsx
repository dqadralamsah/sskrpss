'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';

type PurchaseRequest = {
  id: string;
  status: string;
  requestedBy: { name: string };
  approvedBy: { name: string };
  requestDate: string;
  items: {
    id: string;
    quantity: number;
    rawMaterial: { name: string };
  }[];
};

export default function PurchaseRequestPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isReviseOpen, setIsReviseOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');

  useEffect(() => {
    fetch('/api/purchase-request')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else if (data?.error) {
          alert('Anda tidak memiliki akses ke data ini.');
        }
      })
      .catch(() => {
        alert('Terjadi kesalahan saat memuat data.');
      });
  }, []);

  const openDetail = (req: PurchaseRequest) => {
    setSelectedRequest(req);
    setIsOpen(true);
  };

  const refreshData = () => {
    fetch('/api/purchase-request')
      .then((res) => res.json())
      .then((data) => setRequests(data));
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Apakah anda yakin menghapus Purchase Request ini?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/purchase-request/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        refreshData();
      } else {
        alert('Gagal Menghapus data');
      }
    } catch (error) {
      alert('Terjadi Kesalahan');
      console.error(error);
    }
  };

  const handleApprove = async () => {
    await fetch(`/api/purchase-request/${selectedRequest?.id}/approve`, {
      method: 'POST',
    });
    setIsOpen(false);
    refreshData();
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    await fetch(`/api/purchase-request/${selectedRequest.id}/reject`, {
      method: 'POST',
    });
    setIsOpen(false);
    refreshData();
  };

  const handleRevise = async () => {
    if (!selectedRequest || !revisionNote.trim()) return;
    await fetch(`/api/purchase-request/${selectedRequest.id}/revise`, {
      method: 'POST',
      body: JSON.stringify({ revisionNote }),
    });
    setIsReviseOpen(false);
    setIsOpen(false);
    setRevisionNote('');
    refreshData();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Purchase Requests</h1>

      <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 border w-10">
              <input type="checkbox" />
            </th>
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Requester</th>
            <th className="p-3 border">Approved By</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Date</th>
            <th className="p-3 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-gray-50">
              <td className="p-3 border text-center">
                <input type="checkbox" />
              </td>
              <td className="p-3 border text-xs font-mono text-gray-600">{req.id.slice(0, 9)}</td>
              <td className="p-3 border">{req.requestedBy.name}</td>
              <td className="p-3 border">{req.approvedBy?.name || '-'}</td>
              <td className="p-3 border">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    req.status === 'APPROVED'
                      ? 'bg-green-100 text-green-700'
                      : req.status === 'REJECTED'
                      ? 'bg-red-100 text-red-700'
                      : req.status === 'REVISION'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {req.status}
                </span>
              </td>
              <td className="p-3 border">{new Date(req.requestDate).toLocaleDateString()}</td>
              <td className="p-3 border text-center">
                {/* Diubah jadi Icon edit */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => openDetail(req)}>Lihat</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:bg-red-50"
                      onClick={() => handleDelete(req.id)}
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

      {/* ===== Modal Detail =====*/}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Purchase Request</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>ID:</strong> {selectedRequest.id}
              </p>
              <p>
                <strong>Requester:</strong> {selectedRequest.requestedBy.name}
              </p>
              <p>
                <strong>Approved By:</strong> {selectedRequest.approvedBy?.name || '-'}
              </p>
              <p>
                <strong>Status:</strong> {selectedRequest.status}
              </p>
              <p>
                <strong>Date:</strong> {new Date(selectedRequest.requestDate).toLocaleString()}
              </p>
              <div>
                <strong>Items:</strong>
                <ul className="list-disc list-inside">
                  {selectedRequest.items.map((item) => (
                    <li key={item.id}>
                      {item.rawMaterial.name} — {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tombol aksi */}
              <div className="flex justify-between pt-4">
                {/* Tombol Revise */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReviseOpen(true)}
                  className="text-yellow-700 border-yellow-400 hover:bg-yellow-50"
                >
                  Revise
                </Button>

                {/* Tombol Approve/Reject */}
                <div className="flex gap-2">
                  {selectedRequest.status !== 'REJECTED' && (
                    <Button variant="destructive" size="sm" onClick={handleReject}>
                      Reject
                    </Button>
                  )}
                  {selectedRequest.status !== 'APPROVED' && (
                    <Button variant="default" size="sm" onClick={handleApprove}>
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== Modal Revisi ===== */}
      <Dialog open={isReviseOpen} onOpenChange={setIsReviseOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Alasan Revisi</DialogTitle>
          </DialogHeader>
          <Textarea
            value={revisionNote}
            onChange={(e) => setRevisionNote(e.target.value)}
            placeholder="Tulis alasan revisi di sini..."
          />
          <div className="flex justify-end pt-2">
            <Button onClick={handleRevise} disabled={!revisionNote.trim()}>
              Kirim Revisi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
