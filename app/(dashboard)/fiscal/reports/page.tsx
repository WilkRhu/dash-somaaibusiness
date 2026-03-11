'use client';

import { useState } from 'react';
import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';
import { ExportNotesModal } from '@/components/fiscal/export-notes-modal';
import { showToast } from '@/components/ui/toast';

export default function ReportsPage() {
  const { isLoading } = useFiscalNotes({ autoFetch: false });
  const [showExportModal, setShowExportModal] = useState(false);
  const [reportType, setReportType] = useState('notes');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const handleExport = async (format: 'excel' | 'csv', filters: any) => {
    try {
      // TODO: Implement API call to export notes
      // const blob = await fiscalApi.getNotesReport({
      //   startDate: filters.startDate,
      //   endDate: filters.endDate,
      //   status: filters.status !== 'all' ? filters.status : undefined,
      //   type: filters.type !== 'all' ? filters.type : undefined,
      //   format,
      // });

      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `notas-fiscais-${filters.startDate}-${filters.endDate}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // window.URL.revokeObjectURL(url);

      showToast(`Relatório exportado em ${format.toUpperCase()}`, 'success');
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Relatórios</h1>
        <p className="text-gray-600 mt-2">Gere relatórios e exporte dados fiscais</p>
      </div>

      {/* Tipo de Relatório */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Tipo de Relatório</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors" style={{borderColor: reportType === 'notes' ? '#0066cc' : '#e5e7eb', backgroundColor: reportType === 'notes' ? '#f0f7ff' : 'transparent'}}>
            <input
              type="radio"
              value="notes"
              checked={reportType === 'notes'}
              onChange={(e) => setReportType(e.target.value)}
              className="w-4 h-4"
            />
            <div>
              <p className="font-semibold text-gray-900">Notas Fiscais</p>
              <p className="text-sm text-gray-600">Relatório de todas as notas emitidas</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors" style={{borderColor: reportType === 'sales' ? '#0066cc' : '#e5e7eb', backgroundColor: reportType === 'sales' ? '#f0f7ff' : 'transparent'}}>
            <input
              type="radio"
              value="sales"
              checked={reportType === 'sales'}
              onChange={(e) => setReportType(e.target.value)}
              className="w-4 h-4"
            />
            <div>
              <p className="font-semibold text-gray-900">Vendas vs Notas</p>
              <p className="text-sm text-gray-600">Comparação de vendas com notas fiscais</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors" style={{borderColor: reportType === 'summary' ? '#0066cc' : '#e5e7eb', backgroundColor: reportType === 'summary' ? '#f0f7ff' : 'transparent'}}>
            <input
              type="radio"
              value="summary"
              checked={reportType === 'summary'}
              onChange={(e) => setReportType(e.target.value)}
              className="w-4 h-4"
            />
            <div>
              <p className="font-semibold text-gray-900">Resumo Executivo</p>
              <p className="text-sm text-gray-600">Métricas e indicadores principais</p>
            </div>
          </label>
        </div>
      </div>

      {/* Período */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Período</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Atalhos Rápidos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Atalhos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <button
            onClick={() => {
              const today = new Date();
              const start = new Date(today.getFullYear(), today.getMonth(), 1);
              setDateRange({
                startDate: start.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0],
              });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            Este Mês
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
              const end = new Date(today.getFullYear(), today.getMonth(), 0);
              setDateRange({
                startDate: start.toISOString().split('T')[0],
                endDate: end.toISOString().split('T')[0],
              });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            Mês Anterior
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const start = new Date(today.getFullYear(), 0, 1);
              setDateRange({
                startDate: start.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0],
              });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            Este Ano
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const start = new Date(today.getFullYear() - 1, 0, 1);
              const end = new Date(today.getFullYear() - 1, 11, 31);
              setDateRange({
                startDate: start.toISOString().split('T')[0],
                endDate: end.toISOString().split('T')[0],
              });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            Ano Anterior
          </button>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowExportModal(true)}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
        >
          📥 Exportar Relatório
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          🖨️ Imprimir
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Informação:</strong> Os relatórios são gerados com base nos dados do período selecionado. Você pode exportar em Excel ou CSV para análises adicionais.
        </p>
      </div>

      {/* Export Modal */}
      <ExportNotesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        isLoading={isLoading}
      />
    </div>
  );
}
