'use client';

export function RecentTable({
  title,
  data,
  showSupplier = false,
}: {
  title: string;
  data: {
    id: string;
    createdAt: string;
    status: string;
    supplierName?: string;
  }[];
  showSupplier?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-muted-foreground">
            <th className="text-left py-2">ID</th>
            {showSupplier && <th className="text-left py-2">Supplier</th>}
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b hover:bg-accent transition">
              <td className="py-2">{item.id}</td>
              {showSupplier && <td className="py-2">{item.supplierName}</td>}
              <td className="py-2">
                <span
                  className={
                    item.status === 'APPROVED'
                      ? 'text-sm font-semibold text-green-600'
                      : item.status === 'REJECTED'
                      ? 'text-sm font-semibold text-red-500'
                      : 'text-sm font-semibold text-gray-600'
                  }
                >
                  {item.status}
                </span>
              </td>
              <td className="py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
