'use client';

import { useState, useEffect } from 'react';
import { useInventory } from '@/lib/hooks/use-inventory';
import { useUIStore } from '@/lib/stores/ui-store';
import { InventoryItem, InventoryFilters } from '@/lib/types/inventory';
import { ProductCard } from '@/components/inventory/product-card';
import { AddProductForm } from '@/components/inventory/add-product-form';
import { EditProductForm } from '@/components/inventory/edit-product-form';
import { UpdateStockForm } from '@/components/inventory/update-stock-form';
import { ManageImagesModal } from '@/components/inventory/manage-images-modal';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export default function InventoryPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);
  const [updatingStockProduct, setUpdatingStockProduct] = useState<InventoryItem | null>(null);
  const [managingImagesProduct, setManagingImagesProduct] = useState<InventoryItem | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<InventoryItem | null>(null);
  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    sortBy: 'name',
    sortOrder: 'ASC',
  });
  const [lowStockCount, setLowStockCount] = useState(0);
  const [expiringCount, setExpiringCount] = useState(0);

  const { addToast } = useUIStore();
  const { 
    items, 
    isLoading, 
    error, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateStock,
    getLowStock,
    getExpiring,
    uploadImages,
    deleteImage,
    refetch 
  } = useInventory(filters);

  useEffect(() => {
    const fetchAlerts = async () => {
      const [lowStock, expiring] = await Promise.all([
        getLowStock(),
        getExpiring(30),
      ]);
      setLowStockCount(lowStock.length);
      setExpiringCount(expiring.length);
    };
    fetchAlerts();
  }, [items]);

  const handleAddProduct = async (data: AddProductDto, imageFiles: File[]) => {
    try {
      // Converter imagens para base64
      let imagesBase64: string[] = [];
      if (imageFiles.length > 0) {
        const { filesToBase64 } = await import('@/lib/utils/format');
        imagesBase64 = await filesToBase64(imageFiles);
      }

      // Adicionar imagens ao payload
      const productData = {
        ...data,
        images: imagesBase64.length > 0 ? imagesBase64 : undefined,
      };

      await addProduct(productData);
      addToast({ type: 'success', message: 'Produto adicionado com sucesso!' });
      setShowAddModal(false);
    } catch (err: any) {
      addToast({ type: 'error', message: err.message });
    }
  };

  const handleEditProduct = async (data: any) => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, data);
      addToast({ type: 'success', message: 'Produto atualizado com sucesso!' });
      setEditingProduct(null);
    } catch (err: any) {
      addToast({ type: 'error', message: err.message });
    }
  };

  const handleUpdateStock = async (data: any) => {
    if (!updatingStockProduct) return;
    try {
      await updateStock(updatingStockProduct.id, data);
      addToast({ type: 'success', message: 'Estoque atualizado com sucesso!' });
      setUpdatingStockProduct(null);
    } catch (err: any) {
      addToast({ type: 'error', message: err.message });
    }
  };

  const handleDeleteProduct = async (product: InventoryItem) => {
    setDeletingProduct(product);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.id);
      addToast({ type: 'success', message: 'Produto excluído com sucesso!' });
      setDeletingProduct(null);
    } catch (err: any) {
      addToast({ type: 'error', message: err.message });
    }
  };

  const handleUploadImages = async (images: File[]) => {
    if (!managingImagesProduct) return;
    try {
      await uploadImages(managingImagesProduct.id, images);
      addToast({ type: 'success', message: 'Imagens enviadas com sucesso!' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.message });
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!managingImagesProduct) return;
    try {
      await deleteImage(managingImagesProduct.id, imageUrl);
      addToast({ type: 'success', message: 'Imagem removida com sucesso!' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-navy">Estoque</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
        >
          Adicionar Produto
        </button>
      </div>

      {(lowStockCount > 0 || expiringCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-red-800">Estoque Baixo</h3>
              </div>
              <p className="text-sm text-red-700">
                {lowStockCount} produto{lowStockCount > 1 ? 's' : ''} com estoque abaixo do mínimo
              </p>
            </div>
          )}
          {expiringCount > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-orange-800">Produtos Vencendo</h3>
              </div>
              <p className="text-sm text-orange-700">
                {expiringCount} produto{expiringCount > 1 ? 's' : ''} vencendo nos próximos 30 dias
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nome ou código de barras..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          >
            <option value="name">Nome</option>
            <option value="quantity">Quantidade</option>
            <option value="salePrice">Preço</option>
            <option value="createdAt">Data de Cadastro</option>
          </select>
          <select
            value={filters.sortOrder}
            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as any })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          >
            <option value="ASC">Crescente</option>
            <option value="DESC">Decrescente</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando produtos...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">Nenhum produto cadastrado</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            Adicionar Primeiro Produto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={setEditingProduct}
              onUpdateStock={setUpdatingStockProduct}
              onDelete={handleDeleteProduct}
              onManageImages={setManagingImagesProduct}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Adicionar Produto</h2>
            <AddProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Editar Produto</h2>
            <EditProductForm
              product={editingProduct}
              onSubmit={handleEditProduct}
              onCancel={() => setEditingProduct(null)}
            />
          </div>
        </div>
      )}

      {updatingStockProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Atualizar Estoque</h2>
            <p className="text-gray-600 mb-4">{updatingStockProduct.name}</p>
            <UpdateStockForm
              currentQuantity={updatingStockProduct.quantity}
              unit={updatingStockProduct.unit}
              onSubmit={handleUpdateStock}
              onCancel={() => setUpdatingStockProduct(null)}
            />
          </div>
        </div>
      )}

      {managingImagesProduct && (
        <ManageImagesModal
          product={managingImagesProduct}
          onUpload={handleUploadImages}
          onDelete={handleDeleteImage}
          onClose={() => setManagingImagesProduct(null)}
        />
      )}

      {deletingProduct && (
        <ConfirmModal
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir o produto "${deletingProduct.name}"? Esta ação não pode ser desfeita.`}
          confirmText="Sim, Excluir"
          cancelText="Cancelar"
          confirmVariant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingProduct(null)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
