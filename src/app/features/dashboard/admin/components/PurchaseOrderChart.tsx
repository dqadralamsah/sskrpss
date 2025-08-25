'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface PurchaseOrderChartProps {
  data: { status: string; count: number }[];
}

// Warna per status
const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#fbbf24', // amber
  DELIVERY: '#3b82f6', // blue
  RECEIVED: '#22c55e', // green
  CANCELLED: '#ef4444', // red
};

export function PurchaseOrderChart({ data }: PurchaseOrderChartProps) {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg rounded-xl p-4 transition-transform transform hover:-translate-y-1">
      <CardContent>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Purchase Order Summary</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
            <XAxis dataKey="status" stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f9fafb',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
              }}
              itemStyle={{ color: '#111827', fontWeight: 500 }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#f59e0b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
