'use client';

import { useEffect, useState } from 'react';

type Item = {
  id: string;
  name: string;
  stock: number;
  minStock: number;
};

export default function LowStockList() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/warehouse/low-stock')
      .then((res) => res.json())
      .then(setItems);
  }, []);

  if (items.length === 0) {
    return <p className="text-sm text-gray-500">Semua stok aman.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl p-4 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Nama</th>
            <th className="text-left py-2">Stok</th>
            <th className="text-left py-2">Min. Stok</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2">{item.name}</td>
              <td className="py-2 text-red-600 font-bold">{item.stock}</td>
              <td className="py-2 text-gray-500">{item.minStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
