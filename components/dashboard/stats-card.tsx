interface StatsCardProps {
  title: string;
  value: string;
  description: string;
}

export function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-brand-blue">
      <h3 className="text-sm font-medium text-brand-navy/70 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-brand-navy mb-1">{value}</p>
      <p className="text-sm text-brand-navy/60">{description}</p>
    </div>
  );
}
