'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useKitchenOrders } from '@/lib/hooks/use-kitchen-orders';
import { useInventory } from '@/lib/hooks/use-inventory';
import { OrderType } from '@/lib/types/kitchen-order';
import { isKitchenEstablishment } from '@/lib/constants/establishment-types';
import { showToast } from '@/components/ui/toast';
import OpenCloseModal from '@/components/establishments/open-close-modal';
import { BusinessRole } from '@/lib/types/establishment';

interface OrderItem {
  inventoryItemId: string;
  productName: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  notes: string;
}

export default function CreateKitchenOrderPage() {
  const router = useRouter();
  const { currentEstablishment } = useEstablishmentStore();
  const { createOrder } = useKitchenOrders();
  const { items: inventoryItems, isLoading: inventoryLoading } = useInventory({}, { fetchAll: true });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [showOpenCloseModal, setShowOpenCloseModal] = useState(false);

  // Validar se o estabelecimento é do tipo que possui cozinha
  const isKitchenTypeEstablishment = isKitchenEstablishment(currentEstablishment?.type);

  useEffect(() => {
    if (!isKitchenTypeEstablishment) {
      router.push('/home');
    }
  }, [isKitchenTypeEstablishment, router]);

  // Verificar se o estabelecimento está aberto
  useEffect(() => {
    if (currentEstablishment && currentEstablishment.isOpen === false) {
      setShowOpenCloseModal(true);
    }
  }, [currentEstablishment?.id]);

  // Verificar se o usuário tem permissão para criar pedidos
  useEffect(() => {
    // Apenas proprietários e admins podem criar pedidos
    // Funcionários de cozinha podem criar pedidos normalmente
    const userRole = currentEstablishment?.role;
    const userRoles = currentEstablishment?.roles || [];
    
    const isOwnerOrAdmin = userRole === BusinessRole.OWNER || userRole === BusinessRole.ADMIN ||
      userRoles.includes(BusinessRole.OWNER) || userRoles.includes(BusinessRole.ADMIN);
    
    // Se não é owner/admin, pode ser funcionário de cozinha que tem permissão
    // Remover a restrição para funcionários de cozinha
    if (!isOwnerOrAdmin && !userRoles.some(r => r.includes('kitchen'))) {
      setIsAuthorized(false);
      showToast('Você não tem permissão para criar pedidos', 'error');
      router.push('/home');
    }
  }, [currentEstablishment, router]);

  const [orderType, setOrderType] = useState<OrderType>(OrderType.COUNTER);
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [notes, setNotes] = useState('');
  const [chargeNow, setChargeNow] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const resolveProductImage = (product: any) => {
    const rawImage = product?.images?.[0] || product?.image || '';
    if (!rawImage) return '';
    if (rawImage.startsWith('http://') || rawImage.startsWith('https://') || rawImage.startsWith('data:')) {
      return rawImage;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    return `${apiUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M6.343 3.665c.886-.887 2.318-.887 3.203 0l9.759 9.759c.886.886.886 2.318 0 3.203l-9.759 9.759c-.886.886-2.317.886-3.203 0L3.14 16.168c-.886-.886-.886-2.317 0-3.203L6.343 3.665z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para criar pedidos.</p>
        </div>
      </div>
    );
  }

  const filteredProducts = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (product: any) => {
    const newItem: OrderItem = {
      inventoryItemId: product.id,
      productName: product.name,
      imageUrl: resolveProductImage(product) || undefined,
      quantity: 1,
      unitPrice: parseFloat(String(product.salePrice)) || 0,
      notes: '',
    };
    setItems([...items, newItem]);
    setShowProductModal(false);
    setSearchTerm('');
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const safeValue =
      field === 'quantity'
        ? Math.max(1, Number.isFinite(Number(value)) ? Number(value) : 1)
        : field === 'unitPrice'
          ? Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 0)
          : value;

    newItems[index] = { ...newItems[index], [field]: safeValue };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      showToast('Adicione pelo menos um item ao pedido', 'error');
      return;
    }

    if (items.some(item => item.quantity <= 0 || item.unitPrice <= 0)) {
      showToast('Preencha quantidade e preço corretamente', 'error');
      return;
    }

    if (orderType === OrderType.DINE_IN && !tableNumber) {
      showToast('Informe o número da mesa', 'error');
      return;
    }

    try {
      setIsLoading(true);

      await createOrder({
        orderType,
        tableNumber: orderType === OrderType.DINE_IN ? parseInt(tableNumber) : undefined,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        items: items.map(item => ({
          inventoryItemId: item.inventoryItemId || undefined,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes || undefined,
        })),
        discount: 0,
        notes: notes || undefined,
        priority,
      });

      showToast('Pedido enviado para a cozinha!', 'success');
      router.push('/kitchen/display');
    } catch (error: any) {
      showToast(error.message || 'Erro ao criar pedido', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Modal Abrir/Fechar Estabelecimento */}
      {showOpenCloseModal && (
        <OpenCloseModal
          onClose={() => setShowOpenCloseModal(false)}
          onStatusChange={() => {}}
        />
      )}

      {/* Indicador de status */}
      <button
        onClick={() => setShowOpenCloseModal(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md transition-colors ${
          currentEstablishment?.isOpen
            ? 'bg-green-100 text-green-800 hover:bg-green-200'
            : 'bg-red-100 text-red-800 hover:bg-red-200'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${currentEstablishment?.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
        {currentEstablishment?.isOpen ? 'Aberto' : 'Fechado'}
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6H6m0 0H0" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Novo Pedido</h1>
            <p className="text-gray-600 text-sm">Crie um pedido interno para a cozinha</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        {/* Tipo de Pedido */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tipo de Pedido</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { 
                value: OrderType.COUNTER, 
                label: 'Balcão',
                icon: (
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-0.16 0.28-0.25 0.61-0.25 0.96 0 1.1 0.9 2 2 2h12v-2H7.42c-0.14 0-0.25-0.11-0.25-0.25l0.03-0.12 0.9-1.63h7.45c0.75 0 1.41-0.41 1.75-1.03l3.58-6.49c0.08-0.14 0.12-0.31 0.12-0.48 0-0.55-0.45-1-1-1H5.21l-0.94-2H1zm16 16c-1.1 0-1.99 0.9-1.99 2s0.89 2 1.99 2 2-0.9 2-2-0.9-2-2-2z"/>
                  </svg>
                )
              },
              { 
                value: OrderType.DINE_IN, 
                label: 'Mesa',
                icon: (
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 10.5h4v-1h-4v1zm6-7H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm0 13h-8v-11h8v11z"/>
                  </svg>
                )
              },
              { 
                value: OrderType.DELIVERY, 
                label: 'Entrega',
                icon: (
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 18.5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 003 3 3 3 0 003-3h6a3 3 0 003 3 3 3 0 003-3h2v-5l-3-4z"/>
                  </svg>
                )
              },
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setOrderType(type.value)}
                className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center gap-3 ${
                  orderType === type.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`${orderType === type.value ? 'text-blue-600' : 'text-gray-600'}`}>
                  {type.icon}
                </div>
                <div className="font-semibold text-gray-900">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Informações do Pedido */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informações</h2>
          <div className="grid grid-cols-2 gap-4">
            {orderType === OrderType.DINE_IN && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mesa *
                </label>
                <input
                  type="number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Ex: 5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={orderType === OrderType.DINE_IN}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'normal' | 'high')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Baixa</option>
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cliente
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nome do cliente"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Itens do Pedido</h2>
            <button
              type="button"
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              + Adicionar Produto
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum item adicionado. Clique em "+ Adicionar Produto" para começar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {items.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                    <div className="h-40 w-full">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-400">
                          Sem foto
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Produto
                      </label>
                      <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-900 font-semibold">
                        {item.productName}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Quantidade *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={Number.isFinite(item.quantity) ? item.quantity : 1}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.valueAsNumber)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Preço Unitário *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={Number.isFinite(item.unitPrice) ? item.unitPrice : 0}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.valueAsNumber)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Subtotal
                      </label>
                      <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-900 font-semibold">
                        R$ {(item.quantity * item.unitPrice).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Observações
                    </label>
                    <textarea
                      value={item.notes}
                      onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                      placeholder="Ex: Sem cebola, bem passado"
                      rows={4}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="w-full px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                  >
                    Remover Item
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Seleção de Produtos */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="border-b px-6 py-4 flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">Selecionar Produto</h2>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setSearchTerm('');
                  }}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Search */}
              <div className="border-b px-6 py-4">
                <input
                  type="text"
                  placeholder="Buscar por nome ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* Products List */}
              <div className="p-6 space-y-3">
                {inventoryLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Carregando produtos...
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum produto encontrado
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleAddProduct(product)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                          {resolveProductImage(product) ? (
                            <img
                              src={resolveProductImage(product)}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-400">
                              Sem foto
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{product.name}</div>
                          <div className="text-sm text-gray-600 truncate">
                            {product.category && <span>{product.category}</span>}
                            {product.category && product.brand && <span> • </span>}
                            {product.brand && <span>{product.brand}</span>}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Estoque: {product.quantity} {product.unit}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-blue-600">
                            R$ {(parseFloat(String(product.salePrice)) || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notas Gerais */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notas Gerais</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Informações adicionais sobre o pedido..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Pagamento */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pagamento</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={chargeNow}
                onChange={() => setChargeNow(true)}
                className="w-5 h-5 text-blue-600"
              />
              <div>
                <div className="font-semibold text-gray-900">Cobrar Agora</div>
                <div className="text-sm text-gray-600">Processar pagamento imediatamente</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={!chargeNow}
                onChange={() => setChargeNow(false)}
                className="w-5 h-5 text-blue-600"
              />
              <div>
                <div className="font-semibold text-gray-900">Cobrar Depois</div>
                <div className="text-sm text-gray-600">Enviar para cozinha e cobrar ao final</div>
              </div>
            </label>
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Resumo do Pedido</h2>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-4xl font-bold text-blue-600">
                R$ {calculateTotal().toFixed(2)}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <div>Itens: {items.length}</div>
            <div>Tipo: {orderType === OrderType.COUNTER ? 'Balcão' : orderType === OrderType.DINE_IN ? 'Mesa' : 'Entrega'}</div>
            {orderType === OrderType.DINE_IN && <div>Mesa: {tableNumber || '-'}</div>}
            <div>Prioridade: {priority === 'low' ? 'Baixa' : priority === 'high' ? 'Alta' : 'Normal'}</div>
          </div>

          <div className={`p-3 rounded-lg ${chargeNow ? 'bg-green-100 border border-green-300' : 'bg-yellow-100 border border-yellow-300'}`}>
            <div className="font-semibold text-gray-900">
              {chargeNow ? '✓ Cobrar Agora' : '⏳ Cobrar Depois'}
            </div>
            <div className="text-sm text-gray-700">
              {chargeNow 
                ? 'Pagamento será processado imediatamente' 
                : 'Pedido será enviado para cozinha sem pagamento'}
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 px-6 py-3 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 ${
              chargeNow
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading 
              ? 'Processando...' 
              : chargeNow 
              ? 'Cobrar e Enviar para Cozinha' 
              : 'Enviar para Cozinha'}
          </button>
        </div>
      </form>

      {/* Modal de Adicionar Produto */}
      {/* Removido - agora usa modal integrado */}
    </div>
  );
}
