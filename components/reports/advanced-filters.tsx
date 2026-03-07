'use client';

interface AdvancedFiltersProps {
  filters: {
    startDate: string;
    endDate: string;
    status: string;
    paymentMethod?: string;
  };
  onFilterChange: (filters: any) => void;
}

export function AdvancedFilters({ filters, onFilterChange }: AdvancedFiltersProps) {
  const handleChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const quickRanges = [
    { label: 'Hoje', days: 0 },
    { label: 'Últimos 7 dias', days: 7 },
    { label: 'Últimos 30 dias', days: 30 },
    { label: 'Este mês', days: -1 },
  ];

  const setQuickRange = (days: number) => {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    
    let startDate: string;
    if (days === -1) {
      // Este mês
      startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    } else if (days === 0) {
      // Hoje
      startDate = endDate;
    } else {
      // Últimos X dias
      const start = new Date(today);
      start.setDate(start.getDate() - days);
      startDate = start.toISOString().split('T')[0];
    }
    
    onFilterChange({ ...filters, startDate, endDate });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold text-brand-navy">Filtros</h3>
      
      {/* Quick Ranges */}
      <div>
        <label className="block text-sm font-medium text-brand-navy mb-2">
          Período Rápido
        </label>
        <div className="flex flex-wrap gap-2">
          {quickRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => setQuickRange(range.days)}
              className="px-3 py-1 text-sm border border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-colors"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Data Inicial
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Data Final
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>
      </div>

      {/* Status and Payment Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="completed">Concluídas</option>
            <option value="cancelled">Canceladas</option>
            <option value="pending">Pendentes</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Forma de Pagamento
          </label>
          <select
            value={filters.paymentMethod || ''}
            onChange={(e) => handleChange('paymentMethod', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          >
            <option value="">Todas</option>
            <option value="cash">Dinheiro</option>
            <option value="pix">PIX</option>
            <option value="credit_card">Cartão de Crédito</option>
            <option value="debit_card">Cartão de Débito</option>
            <option value="bank_transfer">Transferência</option>
          </select>
        </div>
      </div>
    </div>
  );
}
