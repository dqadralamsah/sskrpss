'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PurchaseOrderDetail } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PurchaseOrderReceiveDialog from '../components/PurchaseOrderReceiveDialog';

export default function DetailPurchaseOrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [po, setPo] = useState<PurchaseOrderDetail | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/purchase-order/${id}`);
        const data = await res.json();
        setPo(data);
      } catch (error) {
        console.error('Failed to fetch PO detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const refreshPO = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/purchase-order/${id}`);
      const data = await res.json();
      setPo(data);
    } catch (error) {
      console.error('Gagal memuat ulang data PO:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!po) return <p>Data tidak ditemukan.</p>;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-4 text-sm">
          <div>
            <div className="text-muted-foreground">PO ID</div>
            <div className="font-medium">{po.id}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <div className="font-medium">{po.status}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Supplier</div>
            <div className="font-medium">{po.supplier.name}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Created By</div>
            <div className="font-medium">{po.createdBy.name}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Created At</div>
            <div className="font-medium">{new Date(po.createdAt).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Estimated Date</div>
            <div className="font-medium">{new Date(po.estimatedDate).toLocaleDateString()}</div>
          </div>
          {po.orderNotes && (
            <div className="col-span-2">
              <div className="text-muted-foreground">Notes</div>
              <div className="font-medium">{po.orderNotes}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="border rounded-md overflow-x-auto">
        {po.items.length === 0 ? (
          <p className="p-3 text-sm text-gray-500">Belum ada item dalam PO ini.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Nama Bahan Baku</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">Satuan</th>
                <th className="p-3 text-right">Harga Satuan</th>
                <th className="p-3 text-right">Subtotal</th>
                <th className="p-3 text-center">Diterima</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {po.items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.rawMaterial.name}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-center">{item.rawMaterial.unit}</td>
                  <td className="p-3 text-right">Rp {item.unitPrice}</td>
                  <td className="p-3 text-right">
                    Rp {(item.unitPrice * item.quantity).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 text-center">{item.receivedQty}</td>
                  <td className="p-3">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-right text-sm font-medium">
        <p>
          Total: <span className="font-semibold">Rp {po.totalPrice}</span>
        </p>
      </div>

      {po.status !== 'RECEIVED' && session?.user?.id && (
        <div className="flex justify-end">
          <Button onClick={() => setShowDialog(true)}>Terima Barang</Button>
        </div>
      )}

      <div className="flex items-center justify-end">
        <Button variant="ndsbutton" onClick={() => router.back()}>
          Kembali
        </Button>
      </div>

      {currentUserId && (
        <PurchaseOrderReceiveDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          purchaseOrderId={po.id}
          items={po.items}
          currentUserId={session?.user.id}
          onSuccess={refreshPO}
        />
      )}
    </div>
  );
}
