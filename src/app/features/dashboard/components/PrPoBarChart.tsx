'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function PrPoBarChart({
  data,
}: {
  data: { month: string; prCount: number; poCount: number }[];
}) {
  return (
    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Grafik PR & PO per Bulan</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="prCount" fill="#6366f1" name="PR" />
          <Bar dataKey="poCount" fill="#10b981" name="PO" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
