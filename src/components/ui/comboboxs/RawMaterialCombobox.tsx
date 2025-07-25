'use client';

import { useEffect, useState } from 'react';
import { RawMaterial } from '@/types/raw-material';
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
  value: string;
  onChange: (value: string) => void;
};

export default function RawMaterialCombobox({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        const res = await fetch('/api/raw-material');
        const data = await res.json();
        setRawMaterials(data);
      } catch (error) {
        console.error('Gagal mengambil data bahan baku:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRawMaterials();
  }, []);

  const selected = rawMaterials.find((r) => r.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {selected
            ? `${selected.name} (${selected.unit})`
            : loading
            ? 'Memuat...'
            : 'Pilih bahan baku'}
          <ChevronDown size={16} className="ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 max-h-60 overflow-y-auto">
        <Command shouldFilter>
          <CommandInput placeholder="Cari bahan baku..." />
          <CommandEmpty>Tidak ditemukan</CommandEmpty>
          <CommandGroup>
            {rawMaterials.map((rm) => (
              <CommandItem
                key={rm.id}
                value={rm.name}
                onSelect={() => {
                  onChange(rm.id);
                  setOpen(false);
                }}
              >
                {rm.name} ({rm.unit})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
