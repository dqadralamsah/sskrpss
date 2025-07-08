'use client';

import { SearchIcon } from 'lucide-react';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function FilterBar({ value, onChange }: Props) {
  return (
    <div className="relative w-full max-w-sm">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <SearchIcon className="w-4 h-4" />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
        className="pl-10 pr-3 py-2 w-full text-sm border rounded-md bg-white placeholder:text-gray-400"
      />
    </div>
  );
}
