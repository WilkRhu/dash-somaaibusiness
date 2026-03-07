import { useEffect, useCallback } from 'react';
import { useCustomersStore } from '../stores/customers-store';
import { useEstablishmentStore } from '../stores/establishment-store';
import { customersApi } from '../api/customers';
import type { CreateCustomerDto, UpdateCustomerDto } from '../types/customer';

export function useCustomers() {
  const {
    customers,
    selectedCustomer,
    isLoading,
    error,
    searchTerm,
    setCustomers,
    addCustomer,
    updateCustomer: updateCustomerInStore,
    removeCustomer,
    setSelectedCustomer,
    setLoading,
    setError,
    setSearchTerm,
    clearError,
  } = useCustomersStore();

  const { currentEstablishment } = useEstablishmentStore();

  // Carregar clientes
  const loadCustomers = useCallback(async () => {
    if (!currentEstablishment?.id) return;

    setLoading(true);
    clearError();

    try {
      const data = await customersApi.list(currentEstablishment.id, {
        search: searchTerm || undefined,
      });
      setCustomers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, [currentEstablishment?.id, searchTerm, setCustomers, setLoading, setError, clearError]);

  // Criar cliente
  const createCustomer = useCallback(
    async (data: CreateCustomerDto) => {
      if (!currentEstablishment?.id) {
        throw new Error('Nenhum estabelecimento selecionado');
      }

      setLoading(true);
      clearError();

      try {
        const newCustomer = await customersApi.create(currentEstablishment.id, data);
        addCustomer(newCustomer);
        return newCustomer;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Erro ao criar cliente';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [currentEstablishment?.id, addCustomer, setLoading, setError, clearError]
  );

  // Atualizar cliente
  const updateCustomer = useCallback(
    async (customerId: string, data: UpdateCustomerDto) => {
      if (!currentEstablishment?.id) {
        throw new Error('Nenhum estabelecimento selecionado');
      }

      setLoading(true);
      clearError();

      try {
        const updated = await customersApi.update(
          currentEstablishment.id,
          customerId,
          data
        );
        updateCustomerInStore(customerId, updated);
        return updated;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Erro ao atualizar cliente';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [currentEstablishment?.id, updateCustomerInStore, setLoading, setError, clearError]
  );

  // Deletar cliente
  const deleteCustomer = useCallback(
    async (customerId: string) => {
      if (!currentEstablishment?.id) {
        throw new Error('Nenhum estabelecimento selecionado');
      }

      setLoading(true);
      clearError();

      try {
        await customersApi.delete(currentEstablishment.id, customerId);
        removeCustomer(customerId);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Erro ao deletar cliente';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [currentEstablishment?.id, removeCustomer, setLoading, setError, clearError]
  );

  // Adicionar pontos de fidelidade
  const addLoyaltyPoints = useCallback(
    async (customerId: string, points: number) => {
      if (!currentEstablishment?.id) {
        throw new Error('Nenhum estabelecimento selecionado');
      }

      setLoading(true);
      clearError();

      try {
        const updated = await customersApi.addLoyaltyPoints(
          currentEstablishment.id,
          customerId,
          points
        );
        updateCustomerInStore(customerId, updated);
        return updated;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Erro ao adicionar pontos';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [currentEstablishment?.id, updateCustomerInStore, setLoading, setError, clearError]
  );

  // Resgatar pontos de fidelidade
  const redeemLoyaltyPoints = useCallback(
    async (customerId: string, points: number) => {
      if (!currentEstablishment?.id) {
        throw new Error('Nenhum estabelecimento selecionado');
      }

      setLoading(true);
      clearError();

      try {
        const updated = await customersApi.redeemLoyaltyPoints(
          currentEstablishment.id,
          customerId,
          points
        );
        updateCustomerInStore(customerId, updated);
        return updated;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Erro ao resgatar pontos';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [currentEstablishment?.id, updateCustomerInStore, setLoading, setError, clearError]
  );

  // Buscar histórico de compras
  const loadPurchaseHistory = useCallback(
    async (customerId: string) => {
      if (!currentEstablishment?.id) {
        throw new Error('Nenhum estabelecimento selecionado');
      }

      try {
        return await customersApi.getPurchases(currentEstablishment.id, customerId);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Erro ao carregar histórico';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    },
    [currentEstablishment?.id, setError]
  );

  // Carregar clientes ao montar ou quando o termo de busca mudar
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return {
    customers,
    selectedCustomer,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    setSelectedCustomer,
    loadCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    addLoyaltyPoints,
    redeemLoyaltyPoints,
    loadPurchaseHistory,
    clearError,
  };
}
