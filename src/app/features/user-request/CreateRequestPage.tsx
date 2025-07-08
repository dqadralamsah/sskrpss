'use client';

import { useState, useEffect } from 'react';
import { PurchaseRequest, RawMaterial } from './type';
import TableRequest from './components/TableRequest';
import CreateDialog from './components/CreateDialog';
import TablePagination from './components/Pagination';

export default function CreateRequestPage() {
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [userRequests, setUserRequests] = useState<PurchaseRequest[]>([]);
  const [editingPR, setEditingPR] = useState<PurchaseRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedRequests = userRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetch('/api/raw-material')
      .then((res) => res.json())
      .then(setRawMaterials);

    fetch('/api/purchase-request/user')
      .then((res) => res.json())
      .then(setUserRequests);
  }, []);

  const refreshData = async () => {
    const res = await fetch('/api/purchase-request/user');
    const data = await res.json();
    setUserRequests(data);
  };

  return (
    <div className="space-y-6">
      {/* Create Dialog */}
      <CreateDialog
        rawMaterials={rawMaterials}
        onSuccess={async () => {
          await refreshData(); //
        }}
        initialData={editingPR}
        onClose={() => setEditingPR(null)}
      />

      {/* Table Section */}
      <TableRequest data={paginatedRequests} onRevisionClick={setEditingPR} />

      <TablePagination
        currentPage={currentPage}
        totalItems={userRequests.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
