'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';
import { useInventory } from '@/lib/hooks/use-inventory';
import { useSales } from '@/lib/hooks/use-sales';
import { useUIStore } from '@/lib/stores/ui-store';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { inventoryApi } from '@/lib/api/inventory';
import { offersApi } from '@/lib/api/offers';
import { offlineDB, PendingSale } from '@/lib/offline-db';
import { syncPendingSales } from '@/lib/offline-sync';
import CheckoutModal from '@/components/sales/checkout-modal';
import SalePreviewModal from '@/components/sales/sale-preview-modal';
import AddCustomItemModal from '@/components/sales/add-custom-item-modal';
import DiscountModal from '@/components/sales/discount-modal';
import WeightInputModal from '@/components/sales/weight-input-modal';
import SelectWeightProductModal from '@/components/sales/select-weight-product-modal';
import { QuickCustomerSearch } from '@/components/customers/quick-customer-search';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { PaymentMethod, SaleStatus } from '@/lib/types/sale';
import { showToast } from '@/components/ui/toast';
import { InventoryItem } from '@/lib/types/inventory';

export default function POSPage() {
  const [barcode, setBarcode] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [showCustomItemModal, setShowCustomItemModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showItemDiscountModal, setShowItemDiscountModal] = useState(false);
  const [selectedItemForDiscount, setSelectedItemForDiscount] = useState<string | null>(null);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showSelectWeightProductModal, setShowSelectWeightProductModal] = useState(false);
  const [selectedProductForWeight, setSelectedProductForWeight] = useState<InventoryItem | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [activeOffers, setActiveOffers] = useState<Map<string, any>>(new Map());
  const { items, total, subtotal, discount, addItem, removeItem, updateQuantity, updateItemDiscount, setDiscount, clear } = useCartStore();
  const { items: products, refetch: refetchInventory } = useInventory();
  const { createSale, isLoading } = useSales();
  const { sales, refetch: refetchSales } = useSales({ limit: 5, status: SaleStatus.COMPLETED });
  const { setFullscreenMode } = useUIStore();
  const { currentEstablishment } = useEstablishmentStore();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Detectar status de conexão (apenas no cliente)
  useEffect(() => {
    setIsClient(true);
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = async () => {
      setIsOnline(true);
      const result = await syncPendingSales();
      if (result.success > 0) {
        showToast(`${result.success} venda(s) sincronizada(s)!`, 'success');
        refetchSales();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Contar vendas pendentes de sync
  const [pendingSales, setPendingSales] = useState<PendingSale[]>([]);
  
  const loadPendingSales = async () => {
    const sales = await offlineDB.getPendingSales();
    setPendingSales(sales.filter(s => !s.synced));
    setPendingSyncCount(sales.filter(s => !s.synced).length);
  };

  useEffect(() => {
    loadPendingSales();
  }, [items.length]);

  // Carregar ofertas ativas para os produtos
  useEffect(() => {
    const loadActiveOffers = async () => {
      if (!currentEstablishment?.id || !products.length) return;
      
      const offersMap = new Map();
      
      // Verifica ofertas para cada produto
      await Promise.all(
        products.map(async (product: InventoryItem) => {
          try {
            const offerCheck = await offersApi.checkActiveOffer(currentEstablishment.id, product.id);
            if (offerCheck.hasOffer && offerCheck.offer) {
              offersMap.set(product.id, offerCheck.offer);
            }
          } catch (error) {
            // Ignora erros silenciosamente
          }
        })
      );
      
      setActiveOffers(offersMap);
    };
    
    loadActiveOffers();
  }, [products, currentEstablishment]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        if (items.length > 0 && !isPreviewOpen && !isCheckoutOpen) {
          setIsPreviewOpen(true);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (isCheckoutOpen) {
          setIsCheckoutOpen(false);
        } else if (isPreviewOpen) {
          setIsPreviewOpen(false);
        } else if (items.length > 0) {
          setShowClearCartModal(true);
        }
      } else if (e.key === 'F4') {
        e.preventDefault();
        if (items.length > 0) {
          setShowDiscountModal(true);
        }
      } else if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [items, isCheckoutOpen, isPreviewOpen]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Entrar em fullscreen
      document.documentElement.requestFullscreen?.();
      setFullscreenMode(true);
      setIsFullscreen(true);
    } else {
      // Sair de fullscreen
      document.exitFullscreen?.();
      setFullscreenMode(false);
      setIsFullscreen(false);
    }
  };

  // Detectar quando sai do fullscreen pelo ESC do navegador
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        setFullscreenMode(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    if (!isOnline) {
      showToast('Adicione itens apenas com conexão', 'warning');
      setBarcode('');
      return;
    }

    const product = products.find((p: InventoryItem) => p.barcode === barcode);
    if (product) {
      // Verificar se há oferta ativa para este produto
      const offer = activeOffers.get(product.id);
      const salePrice = offer ? Number(offer.offerPrice) : Number(product.salePrice ?? 0);
      
      addItem({
        itemId: product.id,
        name: product.name,
        quantity: 1,
        unitPrice: salePrice,
        discount: 0,
      });
      setBarcode('');
      showToast(offer ? `Produto adicionado com oferta! ${Number(offer.discountPercentage || 0).toFixed(0)}% OFF` : 'Produto adicionado', 'success');
    } else {
      showToast('Produto não encontrado', 'error');
    }
  };

  const handleCheckout = async (paymentMethod: PaymentMethod, _cashRegisterId?: number, notes?: string) => {
    try {
      // Verifica ofertas ativas para cada item
      const itemsWithOffers = await Promise.all(
        items.map(async (item) => {
          try {
            if (!currentEstablishment?.id) {
              return {
                itemId: item.itemId,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                discount: item.discount,
                applyOffer: false,
              };
            }

            const offerCheck = await offersApi.checkActiveOffer(currentEstablishment.id, item.itemId);
            
            return {
              itemId: item.itemId,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              discount: item.discount,
              applyOffer: offerCheck.hasOffer,
            };
          } catch {
            return {
              itemId: item.itemId,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              discount: item.discount,
              applyOffer: false,
            };
          }
        })
      );

      if (!isOnline) {
        // Salvar venda offline
        const pendingSale: PendingSale = {
          id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          items: itemsWithOffers.map(item => ({
            productId: item.itemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity - item.discount,
          })),
          customerId: selectedCustomer?.id,
          paymentMethod,
          total,
          establishmentId: currentEstablishment?.id || '',
          createdAt: new Date().toISOString(),
          synced: false,
        };

        await offlineDB.addPendingSale(pendingSale);
        setPendingSyncCount(prev => prev + 1);
        
        showToast('Venda salva offline! Será sincronizada quando online.', 'warning');
        clear();
        setSelectedCustomer(null);
        setIsCheckoutOpen(false);
        return;
      }

      // Online - enviar normalmente
      await createSale({
        items: itemsWithOffers,
        paymentMethod,
        discount,
        notes,
        customerId: selectedCustomer?.id,
      });
      
      showToast('Venda realizada com sucesso!', 'success');
      clear();
      setSelectedCustomer(null);
      setIsCheckoutOpen(false);
      
      refetchInventory();
      refetchSales();
    } catch (error: any) {
      // Se der erro de rede, salvar offline
      if (!navigator.onLine) {
        const pendingSale: PendingSale = {
          id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          items: items.map(item => ({
            productId: item.itemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.subtotal,
          })),
          customerId: selectedCustomer?.id,
          paymentMethod,
          total,
          establishmentId: currentEstablishment?.id || '',
          createdAt: new Date().toISOString(),
          synced: false,
        };

        await offlineDB.addPendingSale(pendingSale);
        setPendingSyncCount(prev => prev + 1);
        
        showToast('Erro de conexão! Venda salva offline.', 'warning');
        clear();
        setSelectedCustomer(null);
        setIsCheckoutOpen(false);
        return;
      }
      
      showToast(error.message || 'Erro ao finalizar venda', 'error');
    }
  };

  const handleAddCustomItem = async (customItem: { name: string; unitPrice: number; quantity: number }) => {
    try {
      if (!isOnline) {
        showToast('Adicione itens apenas com conexão', 'warning');
        return;
      }

      if (!currentEstablishment?.id) {
        showToast('Nenhum estabelecimento selecionado', 'error');
        return;
      }

      // Cria um produto temporário no inventário
      const tempProduct = await inventoryApi.add(currentEstablishment.id, {
        name: `[AVULSO] ${customItem.name}`,
        category: 'Avulso',
        quantity: customItem.quantity,
        salePrice: customItem.unitPrice,
        costPrice: 0,
        minQuantity: 0,
        unit: 'un',
      });

      // Adiciona o produto ao carrinho
      addItem({
        itemId: tempProduct.data.id,
        name: customItem.name,
        quantity: customItem.quantity,
        unitPrice: customItem.unitPrice,
        discount: 0,
      });

      setShowCustomItemModal(false);
      showToast('Item avulso adicionado', 'success');
      
      // Atualiza a lista de produtos
      refetchInventory();
    } catch (error: any) {
      showToast(error.message || 'Erro ao adicionar item avulso', 'error');
    }
  };

  const handleAddProductToCart = (product: InventoryItem) => {
    // Verificar se há oferta ativa para este produto
    const offer = activeOffers.get(product.id);
    const salePrice = offer ? Number(offer.offerPrice) : Number(product.salePrice ?? 0);
    
    addItem({
      itemId: product.id,
      name: product.name,
      quantity: 1,
      unitPrice: salePrice,
      discount: 0,
    });
    showToast(offer ? `Produto adicionado com oferta! ${Number(offer.discountPercentage || 0).toFixed(0)}% OFF` : 'Produto adicionado', 'success');
  };

  const handleAddWeightProduct = (weight: number) => {
    if (!selectedProductForWeight) return;
    
    // Verificar se há oferta ativa para este produto
    const offer = activeOffers.get(selectedProductForWeight.id);
    const salePrice = offer ? Number(offer.offerPrice) : Number(selectedProductForWeight.salePrice ?? 0);
    
    addItem({
      itemId: selectedProductForWeight.id,
      name: `${selectedProductForWeight.name} (${weight}${selectedProductForWeight.unit})`,
      quantity: weight,
      unitPrice: salePrice,
      discount: 0,
    });
    showToast(offer ? `Produto adicionado com oferta! ${Number(offer.discountPercentage || 0).toFixed(0)}% OFF` : 'Produto adicionado', 'success');
    setSelectedProductForWeight(null);
  };

  const filteredProducts = products.filter((p: InventoryItem) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className={`flex gap-4 ${isFullscreen ? 'h-screen p-6 bg-gray-100' : 'h-[calc(100vh-8rem)]'}`}>
        {/* Indicador de status offline */}
        {isClient && !isOnline && (
          <div className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg font-semibold animate-pulse">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
            <span>Offline</span>
            {pendingSyncCount > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                {pendingSyncCount} pendente{pendingSyncCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Indicador de Caixa Livre - Aparece apenas quando não há itens */}
        {isClient && items.length === 0 && isOnline && (
          <div className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg font-semibold animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span>Caixa Livre</span>
          </div>
        )}

        {/* Botão Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="fixed top-6 right-6 z-50 p-3 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors border-2 border-gray-200"
          title={isFullscreen ? 'Sair do modo tela cheia (F11)' : 'Modo tela cheia (F11)'}
        >
          {isFullscreen ? (
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>

        {/* Lado Esquerdo - Produtos e Lista de Itens */}
        <div className="flex-1 flex flex-col space-y-4">
          {/* Busca de Produtos */}
          <div className="bg-white rounded-lg shadow p-4">
            <form onSubmit={handleBarcodeSubmit} className="space-y-3">
              {/* Busca de Cliente */}
              <QuickCustomerSearch
                selectedCustomer={selectedCustomer}
                onCustomerSelect={setSelectedCustomer}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Barras
                </label>
                <input
                  type="text"
                  placeholder="Escaneie ou digite o código"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar Produto
                  </label>
                  <input
                    type="text"
                    placeholder="Nome ou código do produto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    &nbsp;
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSelectWeightProductModal(true)}
                    className="h-[42px] px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold whitespace-nowrap flex items-center gap-2"
                    title="Vender produto por peso/volume"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    Por Peso
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    &nbsp;
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCustomItemModal(true)}
                    className="h-[42px] px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold whitespace-nowrap flex items-center gap-2"
                    title="Adicionar item avulso (será criado no inventário)"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Item Avulso
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Grid de Produtos */}
          <div className="bg-white rounded-lg shadow p-3 overflow-hidden flex flex-col h-[30%]">
            <h2 className="text-base font-semibold text-brand-navy mb-2">Produtos</h2>
            <div className="grid grid-cols-4 gap-2 overflow-y-auto flex-1">
              {filteredProducts.slice(0, 50).map((product: InventoryItem) => {
                const salePrice = Number(product.salePrice ?? 0);
                const quantity = Number(product.quantity ?? 0);
                const formattedPrice = `R$ ${salePrice.toFixed(2)}`;
                // Prioriza o array de imagens, depois a imagem única
                const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : product.image;
                const hasOffer = activeOffers.has(product.id);
                const offer = activeOffers.get(product.id);
                
                return (
                  <button
                    key={product.id}
                    onClick={() => handleAddProductToCart(product)}
                    disabled={quantity === 0}
                    className={`p-2 border-2 rounded-md transition-all text-left overflow-hidden h-[85px] relative ${
                      quantity === 0 
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : hasOffer
                        ? 'border-orange-400 hover:border-orange-500 hover:shadow-md bg-orange-50'
                        : 'border-gray-200 hover:border-brand-blue hover:shadow-md'
                    }`}
                  >
                    {/* Badge de Oferta */}
                    {hasOffer && offer && (
                      <div className="absolute top-1 right-1 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm z-10">
                        {Number(offer.discountPercentage || 0).toFixed(0)}% OFF
                      </div>
                    )}
                    
                    <div className="flex gap-2 h-[52px]">
                      {/* Imagem do produto */}
                      <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400 text-xl">📦</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Informações do produto */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="font-semibold text-[10px] text-gray-900 truncate leading-tight">
                            {product.name}
                          </div>
                          {product.brand && (
                            <div className="text-[9px] text-gray-500 truncate leading-tight mt-0.5">
                              {product.brand}
                            </div>
                          )}
                          {product.description && (
                            <div className="text-[8px] text-gray-400 truncate leading-tight mt-0.5" title={product.description}>
                              {product.description.length > 30 
                                ? `${product.description.substring(0, 30)}...` 
                                : product.description}
                            </div>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          {hasOffer && offer ? (
                            <>
                              <div className="text-gray-400 line-through text-[9px] leading-tight">
                                R$ {Number(offer.originalPrice || 0).toFixed(2)}
                              </div>
                              <div className="text-orange-600 font-bold text-xs leading-tight">
                                R$ {Number(offer.offerPrice || 0).toFixed(2)}
                              </div>
                            </>
                          ) : (
                            <div className="text-brand-blue font-bold text-xs leading-tight">
                              {formattedPrice}
                            </div>
                          )}
                          {product.unit && (
                            <div className="text-[8px] text-gray-500 leading-tight">
                              /{product.unit}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status do estoque */}
                    <div className={`text-[9px] leading-tight text-center py-0.5 rounded mt-1 ${
                      quantity > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {quantity > 0 ? `Estoque: ${quantity}` : 'Indisponível'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista de Itens (Nota Fiscal) */}
          <div className="bg-white rounded-lg shadow p-4 overflow-hidden flex flex-col flex-1">
            <h2 className="text-lg font-semibold text-brand-navy mb-3">Itens da Venda</h2>
            
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-20 h-20 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-400">Nenhum item adicionado</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">Item</th>
                      <th className="text-center py-2 px-2 font-semibold text-gray-700 text-xs w-20">Qtd</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-700 text-xs w-24">Unit.</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-700 text-xs w-24">Desc.</th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-700 text-xs w-28">Total</th>
                      <th className="text-center py-2 px-2 font-semibold text-gray-700 text-xs w-16">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item, index) => {
                      // Verificar se este item tem oferta ativa
                      const itemOffer = activeOffers.get(item.itemId);
                      const hasOfferApplied = itemOffer && Number(item.unitPrice) === Number(itemOffer.offerPrice);
                      
                      return (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                              {hasOfferApplied && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-orange-100 text-orange-700">
                                  <svg className="w-2.5 h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  OFERTA
                                </span>
                              )}
                            </div>
                          </td>
                        <td className="py-2 px-2">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-xs font-bold"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-right text-gray-700 text-sm">
                          R$ {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-2 px-2">
                          <button
                            onClick={() => {
                              setSelectedItemForDiscount(item.id);
                              setShowItemDiscountModal(true);
                            }}
                            className="w-full text-right text-red-600 text-sm hover:bg-red-50 px-2 py-1 rounded transition-colors"
                            title="Clique para editar desconto"
                          >
                            {item.discount > 0 ? `R$ ${item.discount.toFixed(2)}` : '−'}
                          </button>
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-brand-navy text-sm">
                          R$ {item.subtotal.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remover item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Lado Direito - Carrinho e Total */}
        <div className="w-[420px] flex flex-col space-y-4">
          {/* Display do Total - Estilo Caixa de Mercado */}
          <div className="bg-gradient-to-br from-brand-navy to-brand-blue rounded-lg shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">TOTAL A PAGAR</div>
            <div className="text-5xl font-bold tracking-tight">
              R$ {total.toFixed(2)}
            </div>
            {items.length > 0 && (
              <div className="mt-3 text-sm opacity-90">
                {items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
              </div>
            )}
          </div>

          {/* Resumo Financeiro */}
          {items.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Subtotal:</span>
                <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span className="font-medium">Desconto:</span>
                  <span className="font-semibold">− R$ {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-brand-navy pt-2 border-t border-gray-300">
                <span>TOTAL:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="space-y-2">
            <button 
              onClick={() => setIsPreviewOpen(true)}
              disabled={items.length === 0 || isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {isLoading ? 'Processando...' : 'FINALIZAR VENDA (F2)'}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setShowClearCartModal(true)}
                disabled={items.length === 0}
                className="px-4 py-3 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpar (ESC)
              </button>
              <button 
                onClick={() => setShowDiscountModal(true)}
                disabled={items.length === 0}
                className="px-4 py-3 border-2 border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue/5 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Desconto (F4)
              </button>
            </div>
          </div>

          {/* Vendas Offline Pendentes */}
          {pendingSales.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg shadow p-4">
              <h3 className="text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Vendas Offline Pendentes ({pendingSales.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {pendingSales.map((sale) => (
                  <div key={sale.id} className="bg-white rounded p-2 flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-gray-900">
                        {new Date(sale.createdAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="text-gray-500 ml-2">({sale.items.length} itens)</span>
                    </div>
                    <span className="font-semibold text-orange-600">
                      R$ {sale.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={async () => {
                  const result = await syncPendingSales();
                  if (result.success > 0) {
                    showToast(`${result.success} venda(s) sincronizada(s)!`, 'success');
                    refetchSales();
                    loadPendingSales();
                  }
                }}
                className="mt-3 w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm"
              >
                Sincronizar Agora
              </button>
            </div>
          )}

          {/* Últimas Vendas */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Últimas 5 Vendas Concluídas
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {sales && sales.filter(sale => sale.items && sale.items.length > 0).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-600">Nº</th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-600">Data/Hora</th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-600">Pagamento</th>
                        <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-600">Itens</th>
                        <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sales.filter(sale => sale.items && sale.items.length > 0).slice(0, 5).map((sale) => {
                        const paymentLabels: Record<PaymentMethod, string> = {
                          [PaymentMethod.CASH]: 'Dinheiro',
                          [PaymentMethod.PIX]: 'PIX',
                          [PaymentMethod.DEBIT_CARD]: 'Débito',
                          [PaymentMethod.CREDIT_CARD]: 'Crédito',
                          [PaymentMethod.BANK_TRANSFER]: 'Transferência',
                        };
                        
                        return (
                          <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-2 py-2 font-medium text-gray-900">
                              #{sale.saleNumber}
                            </td>
                            <td className="px-2 py-2 text-gray-600">
                              {new Date(sale.createdAt).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-2 py-2">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-brand-blue/10 text-brand-blue">
                                {paymentLabels[sale.paymentMethod as PaymentMethod] || sale.paymentMethod}
                              </span>
                            </td>
                            <td className="px-2 py-2 text-center text-gray-600">
                              {sale.items.length}
                            </td>
                            <td className="px-2 py-2 text-right font-semibold text-gray-900">
                              R$ {Number(sale.total).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400 text-xs">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Nenhuma venda concluída ainda
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SalePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onConfirm={() => {
          setIsPreviewOpen(false);
          setIsCheckoutOpen(true);
        }}
        items={items}
        subtotal={subtotal}
        discount={discount}
        total={total}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirm={handleCheckout}
        total={total}
        isLoading={isLoading}
      />

      <AddCustomItemModal
        isOpen={showCustomItemModal}
        onClose={() => setShowCustomItemModal(false)}
        onAdd={handleAddCustomItem}
      />

      <WeightInputModal
        isOpen={showWeightModal}
        onClose={() => {
          setShowWeightModal(false);
          setSelectedProductForWeight(null);
        }}
        onConfirm={handleAddWeightProduct}
        productName={selectedProductForWeight?.name || ''}
        unit={selectedProductForWeight?.unit || 'kg'}
        pricePerUnit={Number(selectedProductForWeight?.salePrice ?? 0)}
      />

      <SelectWeightProductModal
        isOpen={showSelectWeightProductModal}
        onClose={() => setShowSelectWeightProductModal(false)}
        onSelect={(product) => {
          setSelectedProductForWeight(product);
          setShowWeightModal(true);
        }}
        products={products}
      />

      <DiscountModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        onApply={(value) => {
          setDiscount(value);
          showToast(value > 0 ? 'Desconto aplicado' : 'Desconto removido', 'success');
        }}
        title="Desconto Geral"
        currentDiscount={discount}
        maxDiscount={subtotal}
      />

      <DiscountModal
        isOpen={showItemDiscountModal}
        onClose={() => {
          setShowItemDiscountModal(false);
          setSelectedItemForDiscount(null);
        }}
        onApply={(value) => {
          if (selectedItemForDiscount) {
            updateItemDiscount(selectedItemForDiscount, value);
            showToast(value > 0 ? 'Desconto aplicado' : 'Desconto removido', 'success');
          }
        }}
        title={`Desconto - ${items.find(i => i.id === selectedItemForDiscount)?.name || 'Item'}`}
        currentDiscount={items.find(i => i.id === selectedItemForDiscount)?.discount || 0}
        maxDiscount={
          selectedItemForDiscount 
            ? (items.find(i => i.id === selectedItemForDiscount)?.unitPrice || 0) * 
              (items.find(i => i.id === selectedItemForDiscount)?.quantity || 1)
            : undefined
        }
      />

      {showClearCartModal && (
        <ConfirmModal
          title="Limpar Carrinho"
          message="Deseja limpar o carrinho?"
          confirmText="Limpar"
          cancelText="Cancelar"
          confirmVariant="danger"
          onConfirm={() => {
            clear();
            setShowClearCartModal(false);
            showToast('Carrinho limpo', 'success');
          }}
          onCancel={() => setShowClearCartModal(false)}
        />
      )}
    </>
  );
}
