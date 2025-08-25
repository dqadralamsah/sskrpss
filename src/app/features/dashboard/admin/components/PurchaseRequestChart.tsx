'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface PurchaseRequestChartProps {
  data: { status: string; count: number }[];
}

// Optional: warna per status
const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#facc15', // yellow
  APPROVED: '#22c55e', // green
  REJECTED: '#ef4444', // red
  REVISED: '#3b82f6', // blue
};

export function PurchaseRequestChart({ data }: PurchaseRequestChartProps) {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg rounded-xl p-4 transition-transform transform hover:-translate-y-1">
      <CardContent>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Purchase Request Summary</h2>
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
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
