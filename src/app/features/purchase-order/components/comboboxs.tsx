'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Supplier, RawMaterial } from '../types';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { ChevronsUpDown } from 'lucide-react';

// Combobox Supplier
export function SupplierCombobox({
  suppliers,
  value,
  onChange,
}: {
  suppliers: Supplier[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = suppliers.find((s) => s.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {selected ? selected.name : 'Pilih Supplier'}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-[580px]">
          <CommandInput placeholder="Cari supplier..." />
          <CommandEmpty>Tidak ditemukan</CommandEmpty>
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

// Combobox Raw Material
export function RawMaterialCombobox({
  rawMaterials,
  value,
  onChange,
}: {
  rawMaterials: RawMaterial[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = rawMaterials.find((r) => r.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {selected ? `${selected.name} (${selected.unit})` : 'Pilih Bahan Baku'}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
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
