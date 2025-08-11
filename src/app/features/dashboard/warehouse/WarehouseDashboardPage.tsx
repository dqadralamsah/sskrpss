'use client';

import { useEffect, useState } from 'react';
import SummaryCard from './components/SummaryCard';
import LowStockList from './components/LowStockList';
import StockMutationDistributionChart from './components/StockMutationDistribution';

type SummaryData = {
  totalRawMaterials: number;
  stockInThisMonth: number;
  stockOutThisMonth: number;
  poReceivedThisMonth: number;
  lowStockCount: number;
};

export default function WarehouseDashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/warehouse')
      .then((res) => res.json())
      .then(setSummary);
  }, []);

  if (!summary) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Bahan Baku" value={summary.totalRawMaterials} />
        <SummaryCard title="Stok Masuk Bulan Ini" value={summary.stockInThisMonth} />
        <SummaryCard title="Stok Keluar Bulan Ini" value={summary.stockOutThisMonth} />
        <SummaryCard title="PO Diterima Bulan Ini" value={summary.poReceivedThisMonth} />
      </div>

      {/* Chart Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Grafik Mutasi Stok (14 Hari Terakhir)</h2>
        <StockMutationDistributionChart />
      </div>

      {/* Low Stock Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Bahan Baku Stok Rendah</h2>
        <LowStockList />
      </div>
    </div>
  );
}
