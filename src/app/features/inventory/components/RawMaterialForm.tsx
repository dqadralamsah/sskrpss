'use client';

import { useState } from 'react';
import { Supplier } from '@/types/supplier';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { RawMaterialFormData } from '@/types/raw-material';
import SupplierCombobox from '@/components/ui/comboboxs/SuplierCombobox';

// Tambahkan props
type Props = {
  onSubmit: (data: RawMaterialFormData) => Promise<void>;
  loading: boolean;
  suppliers: Supplier[];
  initialData?: RawMaterialFormData;
};

export default function RawMaterialForm({ onSubmit, loading, suppliers, initialData }: Props) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [unit, setUnit] = useState(initialData?.unit ?? '');
  const [minStock, setMinStock] = useState(initialData?.minStock?.toString() ?? '');
  const [maxStock, setMaxStock] = useState(initialData?.maxStock?.toString() ?? '');
  const [safetyStock, setSafetyStock] = useState(initialData?.safetyStock?.toString() ?? '');
  const [items, setItems] = useState(
    initialData?.suppliers.map((s) => ({
      supplierId: s.supplierId,
      price: s.price.toString(),
      minOrder: s.minOrder.toString(),
    })) ?? []
  );

  const handleAddItem = () => {
    setItems([...items, { supplierId: '', price: '', minOrder: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleSubmit = async () => {
    const formData: RawMaterialFormData = {
      name,
      description,
      unit,
      minStock: Number(minStock || '0'),
      maxStock: Number(maxStock || '0'),
      safetyStock: Number(safetyStock || '0'),
      suppliers: items
        .filter((item) => item.supplierId)
        .map((item) => ({
          supplierId: item.supplierId,
          price: parseFloat(item.price || '0'),
          minOrder: Number(item.minOrder || '0'),
        })),
    };

    await onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* === KIRI === */}
        <div className="space-y-4">
          <div>
            <label className="font-medium">Nama Bahan Baku</label>
            <Input
              placeholder="Nama Bahan Baku"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Stock Detail */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div>
              <label className="font-medium">Satuan</label>
              <Input placeholder="Satuan" value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
            <div>
              <label className="font-medium">Min</label>
              <Input
                type="number"
                placeholder="Min"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
              />
            </div>
            <div>
              <label className="font-medium">Max</label>
              <Input
                type="number"
                placeholder="Max"
                value={maxStock}
                onChange={(e) => setMaxStock(e.target.value)}
              />
            </div>
            <div>
              <label className="font-medium">Safety</label>
              <Input
                type="number"
                placeholder="Safety"
                value={safetyStock}
                onChange={(e) => setSafetyStock(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* === KANAN === */}
        <div>
          <label className="font-medium">Deskripsi</label>
          <Textarea
            placeholder="Deskripsi"
            className="h-28 min-h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Supplier Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Supplier</h3>
          <Button type="button" variant={'ndsbutton'} onClick={handleAddItem} size="sm">
            <Plus size={16} /> Add Supplier
          </Button>
        </div>

        <div className="space-y-2">
          {/* Label Kolom */}
          <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground">
            <span>Supplier</span>
            <span>Harga</span>
            <span>Min Order</span>
          </div>

          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-1 gap-2  md:grid-cols-4 ">
              <SupplierCombobox
                suppliers={suppliers}
                value={item.supplierId}
                onChange={(val) => {
                  const updated = [...items];
                  updated[i].supplierId = val;
                  setItems(updated);
                }}
              />
              <Input
                type="number"
                placeholder="Harga"
                value={item.price}
                onChange={(e) => {
                  const updated = [...items];
                  updated[i].price = e.target.value;
                  setItems(updated);
                }}
              />
              <Input
                type="number"
                placeholder="Min Order"
                value={item.minOrder}
                onChange={(e) => {
                  const updated = [...items];
                  updated[i].minOrder = e.target.value;
                  setItems(updated);
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveItem(i)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="button" variant={'ndsbutton'} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Save Progress...' : initialData ? 'Save' : 'Add New Material'}
        </Button>
      </div>
    </div>
  );
}
