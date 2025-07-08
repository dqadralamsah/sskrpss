import { PurchaseRequest } from '../type';
import { PencilIcon } from 'lucide-react';

type Props = {
  data: PurchaseRequest[];
  onRevisionClick?: (pr: PurchaseRequest) => void;
};

export default function TableRequest({ data, onRevisionClick }: Props) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted ">
          <tr>
            <th className="p-3 text-left">Material</th>
            <th className="p-3 text-left">Deskripsi</th>
            <th className="p-3 text-center">Jumlah</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-left">Approved By</th>
            <th className="p-3 text-center">Actios</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.flatMap((pr) =>
              pr.items.map((item, idx) => (
                <tr
                  key={`${pr.id}-${idx}`}
                  className="border-t border-muted hover:bg-muted/60 even:bg-muted/40"
                >
                  <td className="p-3">{item.rawMaterial.name}</td>
                  <td className="p-3">{pr.description || '-'}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pr.status === 'APPROVED'
                          ? 'bg-green-100 text-green-700'
                          : pr.status === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : pr.status === 'REVISION'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {pr.status}
                    </span>
                  </td>
                  <td className="p-3 ">{pr.approvedBy?.name ?? '-'}</td>
                  <td className="p-3 text-center">
                    {pr.status === 'REVISION' && (
                      <button
                        onClick={() => onRevisionClick?.(pr)}
                        className="p-1 hover:bg-muted rounded"
                        title="Revisi"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-3 text-muted-foreground">
                Belum ada barang diajukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
