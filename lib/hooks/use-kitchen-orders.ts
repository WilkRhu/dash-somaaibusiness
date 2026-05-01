'use client';

import { useEffect, useCallback } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { kitchenOrdersApi } from '@/lib/api/kitchen-orders';
import { useKitchenOrdersStore } from '@/lib/stores/kitchen-orders-store';
import { useKitchenSocket } from '@/lib/hooks/use-kitchen-socket';
import {
  KitchenOrder,
  KitchenOrderStatus,
  CreateKitchenOrderDto,
  UpdateKitchenOrderStatusDto,
  KitchenOrdersFilters,
} from '@/lib/types/kitchen-order';

export function useKitchenOrders(filters?: KitchenOrdersFilters) {
  const { currentEstablishment } = useEstablishmentStore();
  const {
    orders: allOrders,
    isLoading,
    error,
    fetchOrders,
    setOrder,
    addOrder,
  } = useKitchenOrdersStore();

  // Fetch inicial
  useEffect(() => {
    if (!currentEstablishment?.id) return;
    fetchOrders(currentEstablishment.id);
  }, [currentEstablishment?.id]);

  // Aplica filtros localmente sobre o store
  const orders = filters?.status
    ? allOrders.filter((o) => o.status === filters.status)
    : allOrders;

  const pagination = { total: orders.length, page: 1, limit: filters?.limit || 100 };

  const createOrder = useCallback(
    async (dto: CreateKitchenOrderDto) => {
      if (!currentEstablishment?.id) throw new Error('Estabelecimento não selecionado');
      const newOrder = await kitchenOrdersApi.create(currentEstablishment.id, dto);
      addOrder(newOrder);
      return newOrder;
    },
    [currentEstablishment?.id]
  );

  const updateStatus = useCallback(
    async (orderId: string, dto: UpdateKitchenOrderStatusDto) => {
      if (!currentEstablishment?.id) throw new Error('Estabelecimento não selecionado');
      const updatedOrder = await kitchenOrdersApi.updateStatus(
        currentEstablishment.id,
        orderId,
        dto.status
      );
      setOrder(updatedOrder);
      return updatedOrder;
    },
    [currentEstablishment?.id]
  );

  const cancelOrder = useCallback(
    async (orderId: string) => {
      if (!currentEstablishment?.id) throw new Error('Estabelecimento não selecionado');
      await kitchenOrdersApi.delete(currentEstablishment.id, orderId);
      setOrder({ ...allOrders.find((o) => o.id === orderId)!, status: KitchenOrderStatus.CANCELLED });
    },
    [currentEstablishment?.id, allOrders]
  );

  const getByOrderNumber = useCallback(
    async (orderNumber: string) => {
      if (!currentEstablishment?.id) throw new Error('Estabelecimento não selecionado');
      return await kitchenOrdersApi.getById(currentEstablishment.id, orderNumber);
    },
    [currentEstablishment?.id]
  );

  return {
    orders,
    isLoading,
    error,
    pagination,
    refetch: () => currentEstablishment?.id && fetchOrders(currentEstablishment.id),
    createOrder,
    updateStatus,
    cancelOrder,
    getByOrderNumber,
  };
}
