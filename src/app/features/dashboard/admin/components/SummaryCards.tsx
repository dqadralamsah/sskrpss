'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, ClipboardList, Box } from 'lucide-react';

type Props = {
  purchaseRequests: { status: string; _count: { _all: number } }[];
  purchaseOrders: { status: string; _count: { _all: number } }[];
  stock: { low: number; normal: number; over: number };
};

export function SummaryCards({ purchaseRequests, purchaseOrders, stock }: Props) {
  const totalPR = purchaseRequests.reduce((a, b) => a + b._count._all, 0);
  const totalPO = purchaseOrders.reduce((a, b) => a + b._count._all, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {/* Purchase Requests */}
      <Card className="bg-blue-50 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
        <CardContent className="flex items-center gap-4">
          <div className="p-3 bg-blue-200 rounded-full">
            <ClipboardList className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-blue-500 font-medium">Purchase Requests</p>
            <h2 className="text-3xl font-bold text-blue-700">{totalPR}</h2>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders */}
      <Card className="bg-green-50 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
        <CardContent className="flex items-center gap-4">
          <div className="p-3 bg-green-200 rounded-full">
            <ShoppingCart className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-green-500 font-medium">Purchase Orders</p>
            <h2 className="text-3xl font-bold text-green-700">{totalPO}</h2>
          </div>
        </CardContent>
      </Card>

      {/* Stock Items */}
      <Card className="bg-yellow-50 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
        <CardContent>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-yellow-200 rounded-full">
              <Box className="text-yellow-600" size={24} />
            </div>
            <p className="text-sm text-yellow-500 font-medium">Stock Items</p>
          </div>
          <div className="grid grid-cols-3 text-center">
            <div>
              <p className="text-xs text-gray-500">Low</p>
              <h3 className="text-lg font-semibold text-yellow-700">{stock.low}</h3>
            </div>
            <div>
              <p className="text-xs text-gray-500">Normal</p>
              <h3 className="text-lg font-semibold text-yellow-700">{stock.normal}</h3>
            </div>
            <div>
              <p className="text-xs text-gray-500">Over</p>
              <h3 className="text-lg font-semibold text-yellow-700">{stock.over}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
