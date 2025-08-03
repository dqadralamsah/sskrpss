'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Props = {
  data: { status: string; count: number }[];
};

const COLORS: Record<string, string> = {
  PENDING: '#fbbf24', // kuning
  RECEIVED: '#10b981', // hijau
  REJECTED: '#ef4444', // merah
};

const LABELS: Record<string, string> = {
  PENDING: 'Belum Diterima',
  RECEIVED: 'Sudah Diterima',
  REJECTED: 'Ditolak',
};

export default function StatusDistributionChart({ data }: Props) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Distribusi Status PO</h2>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ status }) => LABELS[status]}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.status]}
                stroke="#f9fafb"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            wrapperStyle={{ outline: 'none' }}
            contentStyle={{
              borderRadius: '0.5rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
            }}
            formatter={(value: any, name: any, props: any) => [
              `${value}`,
              LABELS[props.payload.status],
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-gray-600">{LABELS[value as keyof typeof LABELS]}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
