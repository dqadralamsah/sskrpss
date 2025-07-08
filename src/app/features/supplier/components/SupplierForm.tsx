'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Supplier } from '../type';

type Props = {
  supplier: Supplier | null;
  onClose: () => void;
};

export default function SupplierForm({ supplier, onClose }: Props) {
  const [name, setName] = useState(supplier?.name || '');
  const [email, setEmail] = useState(supplier?.email || '');
  const [phone, setPhone] = useState(supplier?.phone || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(supplier?.name || '');
    setEmail(supplier?.email || '');
    setPhone(supplier?.phone || '');
  }, [supplier]);

  const handleSubmit = async () => {
    setLoading(true);
    const payload = { name, email, phone };

    try {
      if (supplier) {
        await fetch(`/api/supplier/${supplier.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/supplier', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      onClose();
    } catch (error) {
      console.error('[SUPPLIER_FORM_SUBMIT]', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Input
        placeholder="Supplier name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {supplier ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
