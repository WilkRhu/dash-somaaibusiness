import { StatsCard } from '@/components/dashboard/stats-card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-navy">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Vendas Hoje"
          value="R$ 0,00"
          description="0 vendas realizadas"
        />
        <StatsCard
          title="Produtos"
          value="0"
          description="Total no estoque"
        />
        <StatsCard
          title="Alertas"
          value="0"
          description="Produtos com estoque baixo"
        />
        <StatsCard
          title="Clientes"
          value="0"
          description="Clientes cadastrados"
        />
      </div>
    </div>
  );
}
