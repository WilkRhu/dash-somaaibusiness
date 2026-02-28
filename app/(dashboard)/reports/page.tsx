export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-navy">Relatórios</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-brand-blue">
          <h3 className="text-xl font-semibold mb-2 text-brand-navy">Relatório de Vendas</h3>
          <p className="text-brand-navy/70">Análise detalhada das vendas por período</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-brand-green">
          <h3 className="text-xl font-semibold mb-2 text-brand-navy">Relatório de Estoque</h3>
          <p className="text-brand-navy/70">Movimentações e status do estoque</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-brand-blue">
          <h3 className="text-xl font-semibold mb-2 text-brand-navy">Relatório Financeiro</h3>
          <p className="text-brand-navy/70">Receitas, despesas e lucros</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-brand-green">
          <h3 className="text-xl font-semibold mb-2 text-brand-navy">Relatório de Clientes</h3>
          <p className="text-brand-navy/70">Análise de comportamento dos clientes</p>
        </div>
      </div>
    </div>
  );
}
