import { useEffect, useState } from 'react';
import { useSalesStore } from '@/lib/stores/sales-store';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { salesApi } from '@/lib/api/sales';
import { CreateSaleDto, SalesFilters, SaleStatus } from '@/lib/types/sale';

export function useSales(filters?: SalesFilters) {
  const { sales, isLoading, error, setSales, setLoading, setError, updateStats, addSale } = useSalesStore();
  const { currentEstablishment } = useEstablishmentStore();
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  const fetchSales = async (customFilters?: SalesFilters) => {
    if (!currentEstablishment) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await salesApi.list(currentEstablishment.id, customFilters || filters);
      setSales(response.data);
      setPagination({ page: response.page, limit: response.limit, total: response.total });
      
      // Calculate today's stats
      const today = new Date().toISOString().split('T')[0];
      const todaySales = response.data.filter(sale => 
        sale.createdAt.startsWith(today) && sale.status === SaleStatus.COMPLETED
      );
      const total = todaySales.reduce((sum, sale) => sum + sale.total, 0);
      updateStats(total, todaySales.length);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao carregar vendas');
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (dto: CreateSaleDto) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    try {
      setLoading(true);
      setError(null);
      const sale = await salesApi.create(currentEstablishment.id, dto);
      addSale(sale);
      return sale;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar venda';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cancelSale = async (saleId: string, reason: string) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    try {
      setLoading(true);
      setError(null);
      const cancelledSale = await salesApi.cancel(currentEstablishment.id, saleId, reason);
      setSales(sales.map(s => s.id === saleId ? cancelledSale : s));
      return cancelledSale;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao cancelar venda';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getSaleDetails = async (saleId: string) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    try {
      setLoading(true);
      setError(null);
      return await salesApi.getById(currentEstablishment.id, saleId);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar detalhes da venda';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [currentEstablishment?.id]);

  return {
    sales,
    isLoading,
    error,
    pagination,
    refetch: fetchSales,
    createSale,
    cancelSale,
    getSaleDetails,
  };
}
