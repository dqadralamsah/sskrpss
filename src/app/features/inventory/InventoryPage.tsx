'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RawMaterial } from '@/types/raw-material';
import { Button } from '@/components/ui/button';
import FilterBar from './components/FilterBar';
import PaginationBar from '@/components/ui/Pagination/PaginationBar';
import RawMaterialTable from './components/RawMaterialTable';

export default function InventoryPage() {
  const [data, setData] = useState<RawMaterial[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('/api/raw-material')
      .then((res) => res.json())
      .then((data: RawMaterial[]) => {
        const sorted = data.sort((a, b) => b.id.localeCompare(a.id));
        setData(sorted);
        setLoading(false);
      });
  }, []);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginationData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className=" flex items-center justify-between">
        <FilterBar value={search} onChange={setSearch} />
        <Link href="/admin/inventory/create">
          <Button>+ Create</Button>
        </Link>
      </div>

      <RawMaterialTable data={paginationData} loading={loading} />

      {!loading && totalPages > 1 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
