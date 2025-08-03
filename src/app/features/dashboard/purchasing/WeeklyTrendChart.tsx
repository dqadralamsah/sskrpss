'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type Props = {
  data: { week: string; pr: number; po: number }[];
};

export default function WeeklyTrendChart({ data }: Props) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tren PR & PO Mingguan</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
            }}
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          />
          <Legend
            wrapperStyle={{
              fontSize: '14px',
              paddingTop: '8px',
              color: '#374151',
            }}
          />
          <Bar dataKey="pr" name="PR" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={28} />
          <Bar dataKey="po" name="PO" fill="#10b981" radius={[6, 6, 0, 0]} barSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
