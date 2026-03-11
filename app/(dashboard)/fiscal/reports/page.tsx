'use client';

import { useState } from 'react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Relatórios Fiscais</h1>
        <p className="text-gray-600 mt-2">Gere relatórios sobre suas notas fiscais</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              📊 Gerar Relatório
            </button>
          </div>
        </div>
      </div>

      {/* Tipos de Relatório */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Relatório de Notas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Relatório de Notas</h3>
              <p className="text-sm text-gray-600 mt-1">
                Resumo de todas as notas emitidas no período
              </p>
            </div>
            <span className="text-3xl">📄</span>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600">
              <strong>Inclui:</strong> Total de notas, status, valores
            </p>
          </div>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Gerar
          </button>
        </div>

        {/* Relatório Vendas vs Notas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Vendas vs Notas</h3>
              <p className="text-sm text-gray-600 mt-1">
                Comparação entre vendas e notas fiscais emitidas
              </p>
            </div>
            <span className="text-3xl">📈</span>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600">
              <strong>Inclui:</strong> Taxa de conformidade, vendas sem nota
            </p>
          </div>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Gerar
          </button>
        </div>
      </div>

      {/* Informação */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Dica:</strong> Os relatórios podem ser exportados em Excel ou CSV para análise adicional.
        </p>
      </div>
    </div>
  );
}
