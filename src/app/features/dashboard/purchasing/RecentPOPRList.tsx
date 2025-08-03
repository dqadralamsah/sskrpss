'use client';

import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FileTextIcon, PackageIcon } from 'lucide-react';

type Props = {
  data: {
    id: string;
    number: string;
    date: string;
    status: string;
    type: 'PR' | 'PO';
  }[];
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  RECEIVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function RecentPOPRList({ data }: Props) {
  return (
    <Card className="rounded-2xl shadow">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">PR & PO Terbaru</h2>
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-2 hover:bg-gray-50 transition rounded-md px-2"
            >
              <div className="flex items-center gap-3">
                {item.type === 'PR' ? (
                  <FileTextIcon className="text-purple-600 w-5 h-5" />
                ) : (
                  <PackageIcon className="text-blue-600 w-5 h-5" />
                )}
                <div>
                  <div className="font-medium">
                    {item.number}{' '}
                    <span className="text-xs text-muted-foreground">({item.type})</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(item.date), 'dd MMM yyyy', { locale: id })}
                  </div>
                </div>
              </div>
              <div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    STATUS_COLOR[item.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
