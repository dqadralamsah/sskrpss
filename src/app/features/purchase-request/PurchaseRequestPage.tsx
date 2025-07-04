'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PurchaseRequest } from './type';
import TablePurhcaseRequest from './components/TablePurchaseRequest';
import Pagination from './components/Pagination';
import DetailDialog from './components/DetailDialog';
import FilterBar from './components/FilterBar';
import { DateRange } from 'react-day-picker';

export default function PurchaseRequestPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isReviseOpen, setIsReviseOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterRequester, setFilterRequester] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Logic
  const filteredRequests = requests.filter((r) => {
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchRequester = r.requestedBy.name.toLowerCase().includes(filterRequester.toLowerCase());

    const createdAt = new Date(r.createdAt);
    const matchDate =
      !dateRange?.from ||
      !dateRange?.to ||
      (createdAt >= dateRange.from && createdAt <= dateRange.to);

    return matchStatus && matchRequester && matchDate;
  });

  const itemsPerPage = 10;
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetch('/api/purchase-request')
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a: PurchaseRequest, b: PurchaseRequest) =>
          b.id.localeCompare(a.id)
        );
        setRequests(sorted);
      });
  }, []);

  // Refresh Data
  const refreshData = () => {
    fetch('/api/purchase-request')
      .then((res) => res.json())
      .then((data: PurchaseRequest[]) => {
        const sorted = data.sort((a, b) => b.id.localeCompare(a.id));
        setRequests(sorted);
      });
  };

  // Open Detauil
  const openDetail = (req: PurchaseRequest) => {
    setSelectedRequest(req);
    setIsOpen(true);
  };

  // Handle Delete
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

  // Handle Approve
  const handleApprove = async () => {
    if (!selectedRequest) return;

    await fetch('/api/purchase-request/approve', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedRequest.id }),
    });

    setIsOpen(false);
    refreshData();
  };

  // Handle Reject
  const handleReject = async () => {
    if (!selectedRequest) return;

    await fetch('/api/purchase-request/reject', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedRequest.id }),
    });

    setIsOpen(false);
    refreshData();
  };

  // Handle Revise
  const handleRevise = async () => {
    if (!selectedRequest || !revisionNote.trim()) return;

    await fetch('/api/purchase-request/revise', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedRequest.id,
        revisionNote: revisionNote.trim(),
      }),
    });

    setIsReviseOpen(false);
    setIsOpen(false);
    setRevisionNote('');
    refreshData();
  };

  const handlePrint = (req: PurchaseRequest) => {
    setSelectedRequest(req);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="max-w-screen-xl space-y-6">
      {/* FilterBar */}
      <FilterBar
        status={filterStatus}
        onStatusChange={setFilterStatus}
        requester={filterRequester}
        onRequesterChange={setFilterRequester}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Table */}
      <TablePurhcaseRequest
        requests={paginatedRequests}
        onView={openDetail}
        onDelete={handleDelete}
        onPrint={handlePrint}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={requests.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Modal Detail */}
      <DetailDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        request={selectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
        onReviseOpen={() => setIsReviseOpen(true)}
      />

      {/* Modal Revisi */}
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
