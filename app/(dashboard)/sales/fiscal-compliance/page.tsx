'use client';

import { useState, useEffect } from 'react';
import { useSalesFiscalIntegration } from '@/lib/hooks/use-sales-fiscal-integration';
import { useSales } from '@/lib/hooks/use-sales';
import { EmitNoteFromSaleModal } from '@/components/fiscal/emit-note-from-sale-modal';
import { showToast } from '@/components/ui/toast';

interface SaleWithoutNote {
  id: string;
  saleNumber: string;
  total: number;
  items: Array<{
    itemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    discount: number;
  }>;
  customerName?: string;
  customerCpfCnpj?: string;
  customerEmail?: string;
  createdAt: string;
}

export default function FiscalCompliancePage() {
  const { getSalesWithoutNote, emitNoteFromSale, emitNotesInBatch, isLoading } = useSalesFiscalIntegration();
  const [salesWithoutNote, setSalesWithoutNote] = useState<SaleWithoutNote[]>([]);
  const [isLoadingSales, setIsLoadingSales] = useState(true);
  const [showEmitModal, setShowEmitModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleWithoutNote | null>(null);
  const [selectedSales, setSelectedSales] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadSalesWithoutNote();
  }, [dateRange]);

  const loadSalesWithoutNote = async () => {
    setIsLoadingSales(true);
    try {
      const result = await getSalesWithoutNote({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      setSalesWithoutNote(result.data || []);
    } catch (error: any) {
      showToast(error.message || 'Erro ao carregar vendas', 'error');
    } finally {
      setIsLoadingSales(false);
    }
  };

  const handleEmitNote = async (noteData: any) => {
    try {
      await emitNoteFromSale(noteData);
      showToast('Nota fiscal emitida com sucesso!', 'success');
      setShowEmitModal(false);
      setSelectedSale(null);
      loadSalesWithoutNote();
    } catch (error: any) {
      showToast(error.message || 'Erro ao emitir nota', 'error');
    }
  };

  const handleEmitBatch = async () => {
    if (selectedSales.size === 0) {
      showToast('Selecione pelo menos uma venda', 'error');
      return;
    }

    try {
      const result = await emitNotesInBatch(Array.from(selectedSales));
      showToast(
        `${result.success} nota(s) emitida(s) com sucesso! ${result.failed > 0 ? `${result.failed} falharam.` : ''}`,
        result.failed > 0 ? 'warning' : 'success'
      );
      setSelectedSales(new Set());
      loadSalesWithoutNote();
    } catch (error: any) {
      showToast(error.message || 'Erro ao emitir notas em lote', 'error');
    }
  };

  const toggleSaleSelection = (saleId: string) => {
    const newSelected = new Set(selectedSales);
    if (newSelected.has(saleId)) {
      newSelected.delete(saleId);
    } else {
      newSelected.add(saleId);
    }
    setSelectedSales(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedSales.size === salesWithoutNote.length) {
      setSelectedSales(new Set());
    } else {
      setSelectedSales(new Set(salesWithoutNote.map((s) => s.id)));
    }
  };

  const complianceRate = salesWithoutNote.length === 0 ? 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Conformidade Fiscal</h1>
        <p className="text-gray-600 mt-2">Gerencie vendas e emissão de notas fiscais</p>
      </div>

      {/* Indicador de Conformidade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Taxa de Conformidade</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{complianceRate.toFixed(1)}%</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Vendas sem Nota</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{salesWithoutNote.length}</p>
            </div>
            <span className="text-4xl">📄</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Período</p>
              <p className="text-sm font-semibold text-gray-900 mt-2">
                {new Date(dateRange.startDate).toLocaleDateString('pt-BR')} a{' '}
                {new Date(dateRange.endDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <span className="text-4xl">📅</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
            <button
              onClick={loadSalesWithoutNote}
              disabled={isLoadingSales}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
            >
              🔄 Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Vendas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoadingSales ? (
          <div className="p-8 text-center text-gray-500">Carregando vendas...</div>
        ) : salesWithoutNote.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-2">Nenhuma venda sem nota fiscal</p>
            <p className="text-sm text-gray-400">Todas as vendas do período têm notas fiscais emitidas</p>
          </div>
        ) : (
          <>
            {/* Barra de Ações */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedSales.size === salesWithoutNote.length && salesWithoutNote.length > 0}
                  onChange={toggleAllSelection}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  {selectedSales.size > 0 ? `${selectedSales.size} selecionada(s)` : 'Selecionar tudo'}
                </span>
              </div>
              {selectedSales.size > 0 && (
                <button
                  onClick={handleEmitBatch}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                >
                  📄 Emitir {selectedSales.size} Nota(s)
                </button>
              )}
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 w-12">
                      <input
                        type="checkbox"
                        checked={selectedSales.size === salesWithoutNote.length && salesWithoutNote.length > 0}
                        onChange={toggleAllSelection}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Número</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Itens</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {salesWithoutNote.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedSales.has(sale.id)}
                          onChange={() => toggleSaleSelection(sale.id)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium text-brand-navy">{sale.saleNumber}</td>
                      <td className="py-3 px-4 text-gray-600">{sale.customerName || 'Consumidor Final'}</td>
                      <td className="py-3 px-4 text-gray-600">{sale.items.length} item(s)</td>
                      <td className="py-3 px-4 text-right font-semibold text-brand-navy">
                        R$ {sale.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedSale(sale);
                            setShowEmitModal(true);
                          }}
                          className="text-green-600 hover:text-green-800 font-medium text-sm"
                        >
                          Emitir Nota
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Informação:</strong> Aqui você pode visualizar todas as vendas que ainda não têm notas fiscais emitidas e emiti-las em lote ou individualmente.
        </p>
      </div>

      {/* Modal de Emissão */}
      {selectedSale && (
        <EmitNoteFromSaleModal
          isOpen={showEmitModal}
          onClose={() => {
            setShowEmitModal(false);
            setSelectedSale(null);
          }}
          onEmit={handleEmitNote}
          saleData={selectedSale}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
