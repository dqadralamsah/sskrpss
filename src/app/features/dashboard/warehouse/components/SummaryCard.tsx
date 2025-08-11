type Props = {
  title: string;
  value: number;
};

export default function SummaryCard({ title, value }: Props) {
  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
