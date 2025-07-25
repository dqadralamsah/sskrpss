'use client';

import { useEffect, useState } from 'react';
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
import { Supplier } from '@/types/supplier';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SupplierCombobox({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const selected = suppliers.find((s) => s.id === value);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch('/api/supplier');
        const data = await res.json();
        setSuppliers(data);
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {selected?.name ?? (loading ? 'Memuat supplier...' : 'Pilih supplier')}
          <ChevronDown size={16} className="ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 max-h-60 overflow-y-auto">
        <Command className="">
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
