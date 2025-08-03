import { Card, CardContent } from '@/components/ui/card';
import { BarChart2, ClipboardList, Clock, Truck, FilePlus, DollarSign } from 'lucide-react';

type Props = {
  data: {
    totalPRThisMonth: number;
    totalPOThisMonth: number;
    totalPendingPR: number;
    totalProcessingPO: number;
    totalUnorderedPR: number;
    totalPricePOThisMonth: number;
  };
};

const cardItems = [
  {
    label: 'PR Bulan Ini',
    key: 'totalPRThisMonth',
    icon: ClipboardList,
    bg: 'from-indigo-100 to-indigo-50',
  },
  { label: 'PO Bulan Ini', key: 'totalPOThisMonth', icon: Truck, bg: 'from-teal-100 to-teal-50' },
  { label: 'PR Menunggu', key: 'totalPendingPR', icon: Clock, bg: 'from-yellow-100 to-yellow-50' },
  {
    label: 'PO Diproses',
    key: 'totalProcessingPO',
    icon: BarChart2,
    bg: 'from-blue-100 to-blue-50',
  },
  {
    label: 'PR Belum Dibuat PO',
    key: 'totalUnorderedPR',
    icon: FilePlus,
    bg: 'from-rose-100 to-rose-50',
  },
  {
    label: 'Total Harga PO Bulan Ini',
    key: 'totalPricePOThisMonth',
    icon: DollarSign,
    bg: 'from-green-100 to-green-50',
    isCurrency: true,
  },
];

export default function SummaryCards({ data }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cardItems.map((item) => {
        const Icon = item.icon;
        const value = data[item.key as keyof typeof data];

        return (
          <Card key={item.key} className={`rounded-2xl shadow bg-gradient-to-br ${item.bg}`}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white shadow text-muted">
                <Icon className="w-5 h-5 text-nds-purple1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {item.isCurrency ? `Rp ${Number(value).toLocaleString()}` : value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
