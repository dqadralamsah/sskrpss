'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

type Data = {
  type: 'IN' | 'OUT';
  quantity: number;
};

export default function StockMutationDistributionChart() {
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/warehouse/stock-mutation-distribution')
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="w-full h-[300px] bg-white rounded-xl p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
