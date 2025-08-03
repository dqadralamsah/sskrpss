'use client';

import { useEffect, useState } from 'react';
import SummaryCards from './SummaryCards';
import WeeklyTrendChart from './WeeklyTrendChart';
import RecentPOPRList from './RecentPOPRList';
import StatusDistributionChart from './StatusDistributionChart';

type SummaryData = {
  totalPRThisMonth: number;
  totalPOThisMonth: number;
  totalPendingPR: number;
  totalProcessingPO: number;
  totalUnorderedPR: number;
  totalPricePOThisMonth: number;
  weeklyTrend: { week: string; pr: number; po: number }[];
  recentPR: { id: string; createdAt: string; status: string }[];
  recentPO: { id: string; createdAt: string; status: string }[];
  poStatusDistribution: Record<string, number>;
};

export default function PurchasingDashboardPage() {
  const [data, setData] = useState<SummaryData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/purchasing')
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  const recentData = [
    ...data.recentPR.map((pr) => ({
      id: pr.id,
      number: `PR-${pr.id.slice(0, 6)}`,
      date: pr.createdAt,
      status: pr.status,
      type: 'PR' as const,
    })),
    ...data.recentPO.map((po) => ({
      id: po.id,
      number: `PO-${po.id.slice(0, 6)}`,
      date: po.createdAt,
      status: po.status,
      type: 'PO' as const,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const statusDistributionArray = Object.entries(data.poStatusDistribution).map(
    ([status, count]) => ({ status, count })
  );

  return (
    <div className=" space-y-10">
      <SummaryCards data={data} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeeklyTrendChart data={data.weeklyTrend} />

        <StatusDistributionChart data={statusDistributionArray} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent PR & PO</h2>
        <RecentPOPRList data={recentData} />
      </div>
    </div>
  );
}
