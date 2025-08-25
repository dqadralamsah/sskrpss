'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface StockMutationChartProps {
  data: { date: string; in: number; out: number }[];
}

export function StockMutationChart({ data }: StockMutationChartProps) {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg rounded-xl p-5 transition-transform transform hover:-translate-y-1">
      <CardContent>
        <h2 className="text-xl font-semibold mb-5 text-gray-700">Stock Mutation (IN/OUT)</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
            barGap={6}
          >
            <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}
              itemStyle={{ color: '#111827', fontWeight: 500 }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="in" name="IN" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={20} />
            <Bar dataKey="out" name="OUT" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
