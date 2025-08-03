'use client';

import { useEffect, useState } from 'react';
import { StatCards } from '../components/StatCards';
import { PrPoBarChart } from '../components/PrPoBarChart';
import { RecentTable } from '../components/RecentTable';

type Summary = {
  totalPurchaseRequests: number;
  totalPurchaseOrders: number;
  totalRawMaterials: number;
  totalStockMutations: number;
};

type ChartItem = {
  month: string;
  prCount: number;
  poCount: number;
};

type RecentPR = {
  id: string;
  createdAt: string;
  status: string;
};

type RecentPO = {
  id: string;
  createdAt: string;
  status: string;
  supplierName: string;
};

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [recentPRs, setRecentPRs] = useState<RecentPR[]>([]);
  const [recentPOs, setRecentPOs] = useState<RecentPO[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/admin/summary')
      .then((res) => res.json())
      .then(setSummary);
    fetch('/api/dashboard/admin/chart')
      .then((res) => res.json())
      .then((data) => setChartData(data.data));
    fetch('/api/dashboard/admin/recent')
      .then((res) => res.json())
      .then((data) => {
        setRecentPRs(data.recentPRs);
        setRecentPOs(data.recentPOs);
      });
  }, []);

  return (
    <div className="space-y-6 ">
      <StatCards summary={summary} />
      <PrPoBarChart data={chartData} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecentTable title="PR Terbaru" data={recentPRs} />
        <RecentTable title="PO Terbaru" data={recentPOs} showSupplier />
      </div>
    </div>
  );
}
