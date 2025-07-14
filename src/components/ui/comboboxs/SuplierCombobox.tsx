'use client';

import { useEffect, useState } from 'react';
import { Supplier } from '@/types/supplier';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

type Props = {
  suppliers: Supplier[];
  value: string;
  onChange: (values: string) => void;
};

export default function SupplierCombobox({ suppliers, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const selected = suppliers.find((s) => s.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {selected?.name ?? 'Pilih supplier'}
          <ChevronDown size={16} className="ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Cari supplier..." />
          <CommandEmpty>Supplier tidak ditemukan</CommandEmpty>
          <CommandGroup>
            {suppliers.map((s) => (
              <CommandItem
                key={s.id}
                value={s.name}
                onSelect={() => {
                  onChange(s.id);
                  setOpen(false);
                }}
              >
                {s.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
