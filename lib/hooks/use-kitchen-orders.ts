'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { kitchenOrdersApi } from '@/lib/api/kitchen-orders';
import {
  KitchenOrder,
  KitchenOrderStatus,
  CreateKitchenOrderDto,
  UpdateKitchenOrderStatusDto,
  KitchenOrdersFilters,
} from '@/lib/types/kitchen-order';

export function useKitchenOrders(filters?: KitchenOrdersFilters) {
  const { currentEstablishment } = useEstablishmentStore();
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50 });

  const fetchOrders = useCallback(async () => {
    if (!currentEstablishment?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await kitchenOrdersApi.list(currentEstablishment.id, filters);
      setOrders(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
      });
    } catch (err: any) {
      // Se for 404, significa que a rota não existe no backend ainda
      // Retorna array vazio em vez de erro
      if (err.response?.status === 404) {
        setOrders([]);
        setPagination({ total: 0, page: 1, limit: 50 });
        setError(null);
      } else {
        const message = err.response?.data?.message || err.message || 'Erro ao carregar pedidos';
        setError(message);
        console.error('Erro ao carregar pedidos:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentEstablishment?.id, JSON.stringify(filters)]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(
    async (dto: CreateKitchenOrderDto) => {
      if (!currentEstablishment?.id) throw new Error('Estabelecimento não selecionado');

      try {
        setIsLoading(true);
        setError(null);
        const newOrder = await kitchenOrdersApi.create(currentEstablishment.id, dto);
        setOrders((prev) => [newOrder, ...prev]);
        return newOrder;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Erro ao criar pedido';
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [currentEstablishment?.id]
  );

  const updateStatus = useCallback(
    async (orderId: string, dto: UpdateKitchenOrderStatusDto) => {
      if (!currentEstablishment?.id) throw new Error('Estabelecimento não selecionado');

      try {
        setIsLoading(true);
        setError(null);
        const updatedOrder = await kitchenOrdersApi.updateStatus(
          currentEstablishment.id,
          orderId,
          dto.status
        );
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? updatedOrder : order))
        );
        return updatedOrder;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Erro ao atualizar status';
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [currentEstablishment?.id]
  );

  const cancelOrder = useCallback(
    async (orderId: string) => {
      if (!currentEstablishment?.id) throw new Error('Estabelecimento não selecionado');

      try {
        setIsLoading(true);
        setError(null);
        await kitchenOrdersApi.delete(currentEstablishment.id, orderId);
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? { ...order, status: KitchenOrderStatus.CANCELLED } : order))
        );
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Erro ao cancelar pedido';
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [currentEstablishment?.id]
  );

  const getByOrderNumber = useCallback(
    async (orderNumber: string) => {
      if (!currentEstablishment?.id) throw new Error('Estabelecimento não selecionado');

      try {
        setIsLoading(true);
        setError(null);
        return await kitchenOrdersApi.getById(currentEstablishment.id, orderNumber);
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Pedido não encontrado';
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [currentEstablishment?.id]
  );

  return {
    orders,
    isLoading,
    error,
    pagination,
    refetch: fetchOrders,
    createOrder,
    updateStatus,
    cancelOrder,
    getByOrderNumber,
  };
}
