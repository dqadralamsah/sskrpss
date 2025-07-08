'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PurchaseRequest } from '../type';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PurchaseRequest | null;
  onApprove: () => void;
  onReject: () => void;
  onReviseOpen: () => void;
};

export default function DetailDialog({
  open,
  onOpenChange,
  request,
  onApprove,
  onReject,
  onReviseOpen,
}: Props) {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Purchase Request Detail</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-foreground">ID</span>
            <span className="col-span-2">{request.id}</span>

            <span className="font-medium text-foreground">Requester</span>
            <span className="col-span-2">{request.requestedBy.name}</span>

            <span className="font-medium text-foreground">Approved By</span>
            <span className="col-span-2">{request.approvedBy?.name || '-'}</span>

            <span className="font-medium text-foreground">Status</span>
            <span className="col-span-2">{request.status}</span>

            <span className="font-medium text-foreground">Date</span>
            <span className="col-span-2">{new Date(request.requestDate).toLocaleString()}</span>

            <span className="font-medium text-foreground">Description</span>
            <span className="col-span-2 whitespace-pre-line">{request.description || '-'}</span>
          </div>

          <div>
            <span className="block mb-2 font-medium">Items</span>
            <table className="w-full max-h-60 text-sm border  overflow-y-auto">
              <thead className="">
                <tr>
                  <th className="p-2 text-left w-12">No</th>
                  <th className="p-2 text-left">Material</th>
                  <th className="p-2 text-right">Jumlah</th>
                  <th className="p-2 text-left">Satuan</th>
                </tr>
              </thead>
              <tbody>
                {request.items.map((item, index) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.rawMaterial.name}</td>
                    <td className="p-2 text-right">{item.quantity}</td>
                    <td className="p-2">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onReviseOpen}
              className="text-yellow-700 border-yellow-400 hover:bg-yellow-50 hover:text-yellow-700"
            >
              Revise
            </Button>

            <div className="flex gap-2">
              {request.status !== 'REJECTED' && (
                <Button variant="destructive" size="sm" onClick={onReject}>
                  Reject
                </Button>
              )}
              {request.status !== 'APPROVED' && (
                <Button variant="default" size="sm" onClick={onApprove}>
                  Approve
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
