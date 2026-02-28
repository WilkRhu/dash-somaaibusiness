import { useEffect, useState } from 'react';
import { useInventoryStore } from '@/lib/stores/inventory-store';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { inventoryApi } from '@/lib/api/inventory';
import { AddProductDto, UpdateStockDto, InventoryFilters } from '@/lib/types/inventory';

export function useInventory(filters?: InventoryFilters) {
  const { items, isLoading, error, setItems, addItem, updateItem, removeItem, setLoading, setError } = useInventoryStore();
  const { currentEstablishment } = useEstablishmentStore();
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });

  const fetchInventory = async () => {
    if (!currentEstablishment) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await inventoryApi.list(currentEstablishment.id, filters);
      setItems(response.data);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 20,
        totalPages: response.totalPages || 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar estoque');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (dto: AddProductDto) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    try {
      setLoading(true);
      const response = await inventoryApi.add(currentEstablishment.id, dto);
      addItem(response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao adicionar produto';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, dto: Partial<AddProductDto>) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    try {
      setLoading(true);
      const response = await inventoryApi.update(currentEstablishment.id, id, dto);
      updateItem(id, response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar produto';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    try {
      setLoading(true);
      await inventoryApi.delete(currentEstablishment.id, id);
      removeItem(id);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao deletar produto';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: string, dto: UpdateStockDto) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    try {
      setLoading(true);
      const response = await inventoryApi.updateStock(currentEstablishment.id, id, dto);
      updateItem(id, response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar estoque';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getLowStock = async () => {
    if (!currentEstablishment) return [];
    
    try {
      const response = await inventoryApi.getLowStock(currentEstablishment.id);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar produtos com estoque baixo');
      return [];
    }
  };

  const getExpiring = async (daysAhead: number = 30) => {
    if (!currentEstablishment) return [];
    
    try {
      const response = await inventoryApi.getExpiring(currentEstablishment.id, daysAhead);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar produtos vencendo');
      return [];
    }
  };

  const uploadImages = async (itemId: string, images: File[]) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    try {
      setLoading(true);
      const response = await inventoryApi.uploadImages(currentEstablishment.id, itemId, images);
      updateItem(itemId, response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao fazer upload das imagens';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (itemId: string, imageUrl: string) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    console.log('🏪 Deletando imagem do estabelecimento:', {
      establishmentId: currentEstablishment.id,
      establishmentName: currentEstablishment.name,
      itemId,
      imageUrl
    });
    
    try {
      setLoading(true);
      await inventoryApi.deleteImage(currentEstablishment.id, itemId, imageUrl);
      const item = items.find(i => i.id === itemId);
      if (item && item.images) {
        updateItem(itemId, {
          ...item,
          images: item.images.filter(img => img !== imageUrl),
        });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao deletar imagem';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [currentEstablishment?.id, JSON.stringify(filters)]);

  return {
    items,
    isLoading,
    error,
    pagination,
    refetch: fetchInventory,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getLowStock,
    getExpiring,
    uploadImages,
    deleteImage,
  };
}
