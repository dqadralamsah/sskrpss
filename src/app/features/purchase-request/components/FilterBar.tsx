'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { DateRangePicker } from './DateRangePicker';
import { DateRange } from 'react-day-picker';

type Props = {
  status: string;
  onStatusChange: (val: string) => void;
  requester: string;
  onRequesterChange: (val: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
};

export default function FilterBar({
  status,
  onStatusChange,
  requester,
  onRequesterChange,
  dateRange,
  onDateRangeChange,
}: Props) {
  return (
    <div className="w-full flex items-center justify-end gap-2">
      {/* Search */}
      <div className="">
        <Input
          type="text"
          placeholder="Cari requester..."
          value={requester}
          onChange={(e) => onRequesterChange(e.target.value)}
          className="w-[323px]"
        />
      </div>

      <DateRangePicker date={dateRange} setDate={onDateRangeChange} />

      {/* Select Filter */}
      <div>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ALL</SelectItem>
            <SelectItem value="SUBMITTED">SUBMITTED</SelectItem>
            <SelectItem value="APPROVED">APPROVED</SelectItem>
            <SelectItem value="REJECTED">REJECTED</SelectItem>
            <SelectItem value="REVISION">REVISION</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
