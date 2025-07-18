'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { StockMutationFormData } from '@/types/stock-mutation';

type Props = {
  rawMaterialId: string;
  loading: boolean;
  onSubmit: (data: StockMutationFormData) => Promise<void>;
  initialData?: StockMutationFormData;
};

export default function StockMutationForm({
  rawMaterialId,
  loading,
  onSubmit,
  initialData,
}: Props) {
  const [type, setType] = useState<'IN' | 'OUT'>(initialData?.type ?? 'IN');
  const [sourceType, setSourceType] = useState<'PO' | 'MANUAL' | 'USAGE' | 'OPNAME'>(
    initialData?.sourceType ?? 'MANUAL'
  );
  const [quantity, setQuantity] = useState(initialData?.quantity?.toString() ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    const formData: StockMutationFormData = {
      rawMaterialId,
      type,
      sourceType,
      quantity: Number(quantity || '0'),
      description,
    };

    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Gagal menyimpan data.');
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-4"
    >
      <div>
        <label className="text-sm font-medium">Tipe Mutasi</label>
        <Select value={type} onValueChange={(val) => setType(val as 'IN' | 'OUT')}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IN">IN (Masuk)</SelectItem>
            <SelectItem value="OUT">OUT (Keluar)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Sumber Mutasi</label>
        <Select value={sourceType} onValueChange={(val) => setSourceType(val as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih sumber" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PO">PO</SelectItem>
            <SelectItem value="MANUAL">Manual</SelectItem>
            <SelectItem value="USAGE">Usage</SelectItem>
            <SelectItem value="OPNAME">Opname</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Jumlah</label>
        <Input
          type="number"
          placeholder="Masukkan jumlah"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Keterangan</label>
        <Textarea
          placeholder="Keterangan (opsional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="max-h-24"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end">
        <Button type="submit" variant={'ndsbutton'} disabled={loading}>
          {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Mutasi'}
        </Button>
      </div>
    </form>
  );
}
