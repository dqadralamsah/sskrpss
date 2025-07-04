'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { RawMaterial } from '../type';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Item = {
  rawMaterialId: string;
  quantity: number;
  unit: string;
};

type Props = {
  items: Item[];
  updateItem: (index: number, key: keyof Item, value: string | number) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  rawMaterials: RawMaterial[];
};

export default function ItemInputList({
  items,
  updateItem,
  addItem,
  removeItem,
  rawMaterials,
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const getMaterialName = (id: string) => {
    return rawMaterials.find((rm) => rm.id === id)?.name || '';
  };

  return (
    <div className="space-y-4">
      <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-end gap-3">
            {/* Combobox Material */}
            <div className="flex-1 min-w-[150px]">
              <Label className="block mb-1 text-xs text-muted-foreground">Material</Label>
              <Popover
                open={openIndex === index}
                onOpenChange={(open) => setOpenIndex(open ? index : null)}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start font-normal text-muted-foreground"
                  >
                    {getMaterialName(item.rawMaterialId) || 'Material'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari Material..." />
                    <CommandEmpty>Material tidak ditemukan</CommandEmpty>
                    <CommandGroup>
                      {rawMaterials.map((rm) => (
                        <CommandItem
                          key={rm.id}
                          value={rm.name}
                          onSelect={() => updateItem(index, 'rawMaterialId', rm.id)}
                        >
                          {rm.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Jumlah */}
            <div className="w-24">
              <Label className="block mb-1 text-xs text-muted-foreground">Jumlah</Label>
              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', +e.target.value)}
              />
            </div>

            {/* Unit */}
            <div className="w-28">
              <Label className="block mb-1 text-xs text-muted-foreground">Satuan</Label>
              <Input
                placeholder="cth: Kg"
                value={item.unit}
                onChange={(e) => updateItem(index, 'unit', e.target.value)}
              />
            </div>

            {/* Hapus Item */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(index)}
            >
              <X size={16} />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button variant="secondary" size="sm" onClick={addItem}>
          Tambah Item
        </Button>
      </div>
    </div>
  );
}
