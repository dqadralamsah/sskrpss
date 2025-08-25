'use client';

import { useEffect, useState } from 'react';
import { SummaryCards } from './components/SummaryCards';
import { StockMutationChart } from './components/StockMutationChart';
import { PurchaseRequestChart } from './components/PurchaseRequestChart';
import { PurchaseOrderChart } from './components/PurchaseOrderChart';
import { RecentActivity } from './components/RecentActivity';
import { DateRangePicker } from './components/DateRangeFilter';
import { DateRange } from 'react-day-picker';

export function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  // fetch dashboard data berdasarkan range
  async function fetchData(range: DateRange | undefined) {
    if (!range?.from || !range.to) return;
    setLoading(true);

    const start = range.from.toISOString().split('T')[0];
    const end = range.to.toISOString().split('T')[0];

    try {
      const res = await fetch(`/api/dashboard/admin?start=${start}&end=${end}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setData(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-gray-500">Loading...</span>
      </div>
    );

  if (!data)
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-red-500">Failed to load dashboard data.</span>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="flex items-center justify-end gap-4">
        <DateRangePicker date={dateRange} setDate={setDateRange} />
      </div>

      {/* Summary Cards */}
      <SummaryCards
        purchaseRequests={data.summary.purchaseRequests}
        purchaseOrders={data.summary.purchaseOrders}
        stock={data.summary.stock}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PurchaseRequestChart data={data.chart.purchaseRequests} />
        <PurchaseOrderChart data={data.chart.purchaseOrders} />
      </div>

      <StockMutationChart data={data.chart.stockMutation} />

      {/* Recent Activity Tables */}
      <RecentActivity data={data.recent} />
    </div>
  );
}
