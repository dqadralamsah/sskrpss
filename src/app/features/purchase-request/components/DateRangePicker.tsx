'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { Calendar as CalendarIcon } from 'lucide-react';

type Props = {
  date: DateRange | undefined;
  setDate: (range: DateRange | undefined) => void;
};

export function DateRangePicker({ date, setDate }: Props) {
  const [open, setOpen] = useState(false);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const tooltip =
    date?.from && date.to
      ? `${formatDate(date.from)} - ${formatDate(date.to)}`
      : date?.from
      ? formatDate(date.from)
      : 'Pilih rentang tanggal';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" title={tooltip} className="w-fit">
          <CalendarIcon size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar mode="range" selected={date} onSelect={setDate} numberOfMonths={1} />
      </PopoverContent>
    </Popover>
  );
}
