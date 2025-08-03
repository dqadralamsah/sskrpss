import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, ClipboardList, Layers, RefreshCcw } from 'lucide-react';

const cardConfig = [
  {
    title: 'Total PR',
    key: 'totalPurchaseRequests',
    icon: ClipboardList,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Total PO',
    key: 'totalPurchaseOrders',
    icon: BarChart3,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Total Material',
    key: 'totalRawMaterials',
    icon: Layers,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    title: 'Total Mutasi',
    key: 'totalStockMutations',
    icon: RefreshCcw,
    color: 'bg-purple-100 text-purple-600',
  },
];

export function StatCards({ summary }: { summary: Record<string, number> | null }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardConfig.map(({ title, key, icon: Icon, color }) => (
        <Card key={key} className="hover:shadow-md transition">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{summary?.[key] ?? '-'}</p>
            </div>
            <div className={`p-2 rounded-xl ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
