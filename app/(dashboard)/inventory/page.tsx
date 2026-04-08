'use client';

import { useState, useEffect } from 'react';
import { useInventory } from '@/lib/hooks/use-inventory';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { offersApi } from '@/lib/api/offers';
import { InventoryItem, InventoryFilters, AddProductDto, UpdateStockDto, UpdateProductDto } from '@/lib/types/inventory';
import { ProductCard } from '@/components/inventory/product-card';
import { AddProductForm } from '@/components/inventory/add-product-form';
import { EditProductForm } from '@/components/inventory/edit-product-form';
import { UpdateStockForm } from '@/components/inventory/update-stock-form';
import { ManageImagesModal } from '@/components/inventory/manage-images-modal';
import { ConfirmModal } from '@/components/ui/confirm-modal';

type InventoryViewMode = 'cards' | 'table';
type InventoryStatusFilter = 'all' | 'low-stock' | 'expiring' | 'inactive' | 'without-image' | 'with-offer';
type InventoryLocationFilter = 'all' | 'shelf' | 'storage';

export default function InventoryPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);
  const [updatingStockProduct, setUpdatingStockProduct] = useState<InventoryItem | null>(null);
  const [managingImagesProduct, setManagingImagesProduct] = useState<InventoryItem | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<InventoryItem | null>(null);
  const [viewMode, setViewMode] = useState<InventoryViewMode>('cards');
  const [statusFilter, setStatusFilter] = useState<InventoryStatusFilter>('all');
  const [locationFilter, setLocationFilter] = useState<InventoryLocationFilter>('all');
  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    category: '',
    brand: '',
    sortBy: 'name',
    sortOrder: 'ASC',
    limit: 100,
  });
  const [lowStockCount, setLowStockCount] = useState(0);
  const [expiringCount, setExpiringCount] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [offerItemIds, setOfferItemIds] = useState<string[]>([]);

  const { currentEstablishment } = useEstablishmentStore();
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
    
    // Extrair categorias únicas dos produtos
    const uniqueCategories = Array.from(new Set(items.map(item => item.category).filter(Boolean))) as string[];
    setCategories(uniqueCategories.sort());
    const uniqueBrands = Array.from(new Set(items.map(item => item.brand).filter(Boolean))) as string[];
    setBrands(uniqueBrands.sort());
  }, [items]);

  useEffect(() => {
    const fetchActiveOffers = async () => {
      if (!currentEstablishment?.id) {
        setOfferItemIds([]);
        return;
      }

      try {
        const response = await offersApi.list(currentEstablishment.id, {
          isActive: true,
          limit: 200,
        });
        const ids = (response.data || [])
          .map((offer) => offer.itemId)
          .filter(Boolean);
        setOfferItemIds(Array.from(new Set(ids)));
      } catch {
        setOfferItemIds([]);
      }
    };

    fetchActiveOffers();
  }, [currentEstablishment?.id]);

  const isExpiringSoon = (expirationDate?: string | null) => {
    if (!expirationDate) return false;
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + 30);
    return new Date(expirationDate) <= threshold;
  };

  const visibleItems = items.filter((item) => {
    if (statusFilter === 'low-stock' && item.quantity > item.minQuantity) return false;
    if (statusFilter === 'expiring' && !isExpiringSoon(item.expirationDate)) return false;
    if (statusFilter === 'inactive' && item.isActive) return false;
    if (statusFilter === 'without-image' && ((item.images?.length || 0) > 0 || item.image)) return false;
    if (statusFilter === 'with-offer' && !offerItemIds.includes(item.id)) return false;
    const shelfQuantity = Number(item.shelfQuantity ?? 0);
    const storageQuantity = Number(item.storageQuantity ?? Math.max(Number(item.quantity || 0) - shelfQuantity, 0));
    if (locationFilter === 'shelf' && shelfQuantity <= 0) return false;
    if (locationFilter === 'storage' && storageQuantity <= 0) return false;
    return true;
  });

  const quickStats = [
    { key: 'all' as const, label: 'Todos', count: items.length, tone: 'bg-slate-50 text-slate-700 border-slate-200' },
    { key: 'low-stock' as const, label: 'Estoque baixo', count: lowStockCount, tone: 'bg-red-50 text-red-700 border-red-200' },
    { key: 'expiring' as const, label: 'Vencendo', count: expiringCount, tone: 'bg-orange-50 text-orange-700 border-orange-200' },
    { key: 'without-image' as const, label: 'Sem imagem', count: items.filter((item) => !(item.image || item.images?.length)).length, tone: 'bg-amber-50 text-amber-700 border-amber-200' },
    { key: 'with-offer' as const, label: 'Com oferta', count: items.filter((item) => offerItemIds.includes(item.id)).length, tone: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
  ];

  const activeCount = items.filter((item) => item.isActive).length;
  const inactiveCount = items.length - activeCount;
  const shelfItemsCount = items.filter((item) => Number(item.shelfQuantity ?? 0) > 0).length;
  const storageItemsCount = items.filter((item) => Number(item.storageQuantity ?? item.quantity) > 0).length;
  const totalShelfQuantity = items.reduce((sum, item) => sum + Number(item.shelfQuantity ?? 0), 0);
  const totalStorageQuantity = items.reduce(
    (sum, item) => sum + Number(item.storageQuantity ?? Math.max(Number(item.quantity || 0) - Number(item.shelfQuantity ?? 0), 0)),
    0
  );

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      return apiError.response?.data?.message || fallback;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  };

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
    } catch (err: unknown) {
      addToast({ type: 'error', message: getErrorMessage(err, 'Erro ao adicionar produto') });
    }
  };

  const handleEditProduct = async (data: UpdateProductDto) => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, data);
      addToast({ type: 'success', message: 'Produto atualizado com sucesso!' });
      setEditingProduct(null);
    } catch (err: unknown) {
      addToast({ type: 'error', message: getErrorMessage(err, 'Erro ao atualizar produto') });
    }
  };

  const handleUpdateStock = async (data: UpdateStockDto) => {
    if (!updatingStockProduct) return;
    try {
      await updateStock(updatingStockProduct.id, data);
      addToast({ type: 'success', message: 'Estoque atualizado com sucesso!' });
      setUpdatingStockProduct(null);
    } catch (err: unknown) {
      addToast({ type: 'error', message: getErrorMessage(err, 'Erro ao atualizar estoque') });
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
    } catch (err: unknown) {
      addToast({ type: 'error', message: getErrorMessage(err, 'Erro ao excluir produto') });
    }
  };

  const handleUploadImages = async (images: File[]) => {
    if (!managingImagesProduct) return;
    try {
      await uploadImages(managingImagesProduct.id, images);
      addToast({ type: 'success', message: 'Imagens enviadas com sucesso!' });
    } catch (err: unknown) {
      addToast({ type: 'error', message: getErrorMessage(err, 'Erro ao enviar imagens') });
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!managingImagesProduct) return;
    try {
      await deleteImage(managingImagesProduct.id, imageUrl);
      addToast({ type: 'success', message: 'Imagem removida com sucesso!' });
    } catch (err: unknown) {
      addToast({ type: 'error', message: getErrorMessage(err, 'Erro ao remover imagem') });
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
          <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {quickStats.map((stat) => (
              <button
                key={stat.key}
                onClick={() => setStatusFilter(stat.key)}
                className={`text-left rounded-xl border px-4 py-3 transition-all ${
                  statusFilter === stat.key
                    ? 'ring-2 ring-brand-blue shadow-sm'
                    : 'hover:shadow-sm'
                } ${stat.tone}`}
              >
                <div className="text-xs uppercase tracking-wide font-semibold opacity-80">{stat.label}</div>
                <div className="mt-1 text-2xl font-bold">{stat.count}</div>
              </button>
            ))}
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide font-semibold text-slate-500">Ativos / Inativos</div>
              <div className="mt-1 flex items-center gap-3 text-sm">
                <span className="font-semibold text-emerald-700">{activeCount} ativos</span>
                <span className="text-slate-300">|</span>
                <span className="font-semibold text-slate-600">{inactiveCount} inativos</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setLocationFilter('all')}
              className={`rounded-xl border px-4 py-3 text-left transition-all ${
                locationFilter === 'all' ? 'ring-2 ring-brand-blue shadow-sm' : 'hover:shadow-sm'
              } bg-white border-gray-200`}
            >
              <div className="text-xs uppercase tracking-wide font-semibold text-gray-500">Localização</div>
              <div className="mt-1 text-lg font-bold text-gray-900">Todas</div>
              <div className="text-xs text-gray-500">{items.length} produtos</div>
            </button>
            <button
              onClick={() => setLocationFilter('shelf')}
              className={`rounded-xl border px-4 py-3 text-left transition-all ${
                locationFilter === 'shelf' ? 'ring-2 ring-brand-blue shadow-sm' : 'hover:shadow-sm'
              } bg-blue-50 border-blue-200`}
            >
              <div className="text-xs uppercase tracking-wide font-semibold text-blue-600">Prateleira</div>
              <div className="mt-1 text-lg font-bold text-blue-900">{shelfItemsCount} produtos</div>
              <div className="text-xs text-blue-700">{totalShelfQuantity} un expostas</div>
            </button>
            <button
              onClick={() => setLocationFilter('storage')}
              className={`rounded-xl border px-4 py-3 text-left transition-all ${
                locationFilter === 'storage' ? 'ring-2 ring-brand-blue shadow-sm' : 'hover:shadow-sm'
              } bg-slate-50 border-slate-200`}
            >
              <div className="text-xs uppercase tracking-wide font-semibold text-slate-500">Depósito</div>
              <div className="mt-1 text-lg font-bold text-slate-900">{storageItemsCount} produtos</div>
              <div className="text-xs text-slate-600">{totalStorageQuantity} un guardadas</div>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Categorias
                </label>
                <button
                  onClick={() => {
                    setFilters({ ...filters, category: '', brand: '' });
                    setLocationFilter('all');
                  }}
                  className="text-xs font-semibold text-brand-blue hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters({ ...filters, category: '' })}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !filters.category
                      ? 'bg-brand-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todas ({items.length})
                </button>
                {categories.slice(0, 6).map((category) => {
                  const count = items.filter(item => item.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setFilters({ ...filters, category })}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filters.category === category
                          ? 'bg-brand-blue text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
                {categories.length > 6 && (
                  <select
                    value={categories.slice(0, 6).includes(filters.category || '') ? '' : filters.category || ''}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value || '' })}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <option value="">Mais categorias...</option>
                    {categories.slice(6).map((category) => {
                      const count = items.filter(item => item.category === category).length;
                      return (
                        <option key={category} value={category}>
                          {category} ({count})
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <select
                  value={filters.brand || ''}
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value || '' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  <option value="">Todas as marcas</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visualização
                </label>
                <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${
                      viewMode === 'cards' ? 'bg-brand-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${
                      viewMode === 'table' ? 'bg-brand-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Tabela
                  </button>
                </div>
              </div>
            </div>

            {/* Busca e Ordenação */}
            <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar por nome ou código de barras..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as InventoryFilters['sortBy'] })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="name">Nome</option>
              <option value="quantity">Quantidade</option>
              <option value="salePrice">Preço</option>
              <option value="createdAt">Data de Cadastro</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as InventoryFilters['sortOrder'] })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="ASC">Crescente</option>
              <option value="DESC">Decrescente</option>
            </select>
            </div>
          </div>
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
      ) : visibleItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">
            {items.length === 0
              ? 'Nenhum produto cadastrado'
              : locationFilter !== 'all'
                ? 'Nenhum produto encontrado nesta localização'
              : statusFilter === 'with-offer'
                ? 'Nenhum produto em oferta encontrado'
                : 'Nenhum produto encontrado com os filtros atuais'}
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            {items.length === 0 ? 'Adicionar Primeiro Produto' : 'Adicionar Produto'}
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleItems.map((product) => (
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
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Produto</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Categoria / Marca</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Estoque</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Localização</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Preço</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {visibleItems.map((product) => {
                      const lowStock = product.quantity <= product.minQuantity;
                      const expiringSoon = isExpiringSoon(product.expirationDate);
                      const hasImage = Boolean(product.image || (product.images && product.images.length > 0));
                      const shelfQuantity = Number(product.shelfQuantity ?? 0);
                      const storageQuantity = Number(product.storageQuantity ?? Math.max(Number(product.quantity || 0) - shelfQuantity, 0));

                      return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 overflow-hidden rounded-lg bg-gray-100">
                                {hasImage ? (
                                  <img src={product.images?.[0] || product.image || ''} alt={product.name} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{product.name}</div>
                                {product.barcode && (
                                  <div className="text-xs text-gray-500 font-mono">{product.barcode}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">{product.category || '-'}</div>
                            <div className="text-xs text-gray-500">{product.brand || 'Sem marca'}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className={`font-semibold ${lowStock ? 'text-red-600' : 'text-gray-900'}`}>
                              {Math.floor(product.quantity)} {product.unit}
                            </div>
                            <div className="text-xs text-gray-500">
                              mínimo {product.minQuantity} {product.unit}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1 text-xs">
                              <span className="inline-flex w-fit rounded-full bg-blue-50 px-2 py-1 font-semibold text-blue-700">
                                Prateleira: {shelfQuantity} {product.unit}
                              </span>
                              <span className="inline-flex w-fit rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                                Depósito: {storageQuantity} {product.unit}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-green-600">
                              {product.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                            <div className="text-xs text-gray-500">
                              custo {product.costPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-2">
                              {lowStock && (
                                <span className="inline-flex w-fit rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">Estoque baixo</span>
                              )}
                              {expiringSoon && (
                                <span className="inline-flex w-fit rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">Vence em breve</span>
                              )}
                              {!lowStock && !expiringSoon && (
                                <span className="inline-flex w-fit rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">OK</span>
                              )}
                              {!hasImage && (
                                <span className="inline-flex w-fit rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">Sem imagem</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => setUpdatingStockProduct(product)}
                                className="rounded-lg bg-brand-blue px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                              >
                                Estoque
                              </button>
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => setManagingImagesProduct(product)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                              >
                                Imagens
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
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
