import { useEffect, useCallback, useMemo } from 'react';
import { useSuppliersStore } from '../stores/suppliers-store';
import { useEstablishmentStore } from '../stores/establishment-store';
import { suppliersApi } from '../api/suppliers';
import type {
  CreateSupplierDto,
  UpdateSupplierDto,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderStatusDto,
} from '../types/supplier';

export function useSuppliers() {
  const {
    suppliers,
    selectedSupplier,
    purchaseOrders,
    selectedOrder,
    isLoading,
    error,
    searchTerm,
    hasLoaded,
    setSuppliers,
    addSupplier,
    updateSupplier: updateSupplierInStore,
    removeSupplier,
    setSelectedSupplier,
    setPurchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrder: updateOrderInStore,
    setSelectedOrder,
    setLoading,
    setError,
    setSearchTerm,
    setHasLoaded,
    clearError,
  } = useSuppliersStore();

  const { currentEstablishment } = useEstablishmentStore();

  // Carregar fornecedores
  const loadSuppliers = useCallback(async () => {
    if (!currentEstablishment?.id) return;

    setLoading(true);
    clearError();

    try {
      const data = await suppliersApi.list(currentEstablishment.id);
      setSuppliers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  }, [currentEstablishment?.id, setSuppliers, setLoading, setError, clearError]);

  // Criar fornecedor
  const createSupplier = useCallback(
    async (data: CreateSupplierDto) => {
      if (!currentEstablishment?.id) {
        throw new Error('Nenhum estabelecimento selecionado');
      }

      setLoading(true);
      clearError();

      try {
        const newSupplier = await suppliersApi.create(currentEstablishment.id, data);
        addSupplier(newSupplier);
        return newSupplier;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Erro ao criar fornecedor';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [currentEstablishment?.id, addSupplier, setLoading, setError, clearError]
  );

  // Atualizar fornecedor
  const updateSupplier = useCallback(
    async (supplierId: string, data: UpdateSupplierDto) => {
      if (!currentEstablishment?.id) {
        throw new Error('Nenhum estabelecimento selecionado');
      }

      setLoading(true);
      clearError();

      try {
        const updated = await suppliersApi.update(
          currentEstablishment.id,
          supplierId,
          data
        );
        updateSupplierInStore(supplierId, updated);
        return updated;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Erro ao atualizar fornecedor';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [currentEstablishment?.id, updateSupplierInStore, setLoading, setError, clearError]
  );

  // Deletar fornecedor
  const deleteSupplier = useCallback(
    async (supplierId: string) => {
      if (!currentEstablishment?.id) {
        throw new Error('Nenhum estabelecimento selecionado');
      }

      setLoading(true);
      clearError();

      try {
        await suppliersApi.delete(currentEstablishment.id, supplierId);
        removeSupplier(supplierId);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Erro ao deletar fornecedor';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [currentEstablishment?.id, removeSupplier, setLoading, setError, clearError]
  );

  // Carregar pedidos de compra
  const loadPurchaseOrders = useCallback(
    async (supplierId?: string) => {
      if (!currentEstablishment?.id) return;

      setLoading(true);
      clearError();

      try {
        const data = await suppliersApi.listOrders(currentEstablishment.id, supplierId);
        setPurchaseOrders(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar pedidos');
      } finally {
        setLoading(false);
      }
    },
    [currentEstablishment?.id, setPurchaseOrders, setLoading, setError, clearError]
  );

  // Criar pedido de compra
  const createPurchaseOrder = useCallback(
    async (supplierId: string, data: CreatePurchaseOrderDto) => {
      if (!currentEstablishment?.id) {
        throw new Error('Nenhum estabelecimento selecionado');
      }

      setLoading(true);
      clearError();

      try {
        const newOrder = await suppliersApi.createOrder(
          currentEstablishment.id,
          supplierId,
          data
        );
        addPurchaseOrder(newOrder);
        return newOrder;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Erro ao criar pedido';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [currentEstablishment?.id, addPurchaseOrder, setLoading, setError, clearError]
  );

  // Atualizar status do pedido
  const updateOrderStatus = useCallback(
    async (orderId: string, data: UpdatePurchaseOrderStatusDto) => {
      if (!currentEstablishment?.id) {
        throw new Error('Nenhum estabelecimento selecionado');
      }

      setLoading(true);
      clearError();

      try {
        const updated = await suppliersApi.updateOrderStatus(
          currentEstablishment.id,
          orderId,
          data
        );
        updateOrderInStore(orderId, updated);
        return updated;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Erro ao atualizar status';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [currentEstablishment?.id, updateOrderInStore, setLoading, setError, clearError]
  );

  // Carregar fornecedores ao montar (apenas uma vez globalmente)
  useEffect(() => {
    if (!currentEstablishment?.id || hasLoaded) return;
    
    const fetchSuppliers = async () => {
      setLoading(true);
      clearError();

      try {
        const data = await suppliersApi.list(currentEstablishment.id);
        setSuppliers(data);
        setHasLoaded(true);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar fornecedores');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEstablishment?.id, hasLoaded]);

  // Filtrar fornecedores por termo de busca
  const filteredSuppliers = useMemo(() => {
    if (!suppliers || suppliers.length === 0) return [];
    
    return suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.cnpj && supplier.cnpj.includes(searchTerm)) ||
      (supplier.cpf && supplier.cpf.includes(searchTerm)) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  return {
    suppliers: filteredSuppliers,
    selectedSupplier,
    purchaseOrders,
    selectedOrder,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    setSelectedSupplier,
    setSelectedOrder,
    loadSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    loadPurchaseOrders,
    createPurchaseOrder,
    updateOrderStatus,
    clearError,
  };
}
