'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePublicDeliveryOrder, useDeliveryFeeCalculation, useDeliveryAvailability } from '@/lib/hooks/use-public-delivery';
import { PaymentMethod } from '@/lib/types/delivery';
import { formatCurrency } from '@/lib/utils/format';
import { showToast } from '@/components/ui/toast';
import { useRouter, useSearchParams } from 'next/navigation';

interface OrderItem {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

function NewDeliveryOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const establishmentId = searchParams.get('establishment') || '';

  const [step, setStep] = useState<'address' | 'items' | 'payment' | 'confirm'>('address');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    deliveryNeighborhood: '',
    deliveryCity: '',
    deliveryState: 'SP',
    deliveryZipCode: '',
    deliveryComplement: '',
    deliveryReference: '',
    paymentMethod: PaymentMethod.PIX,
    notes: '',
  });

  const [newItem, setNewItem] = useState({
    productName: '',
    unitPrice: 0,
    quantity: 1,
  });

  const { createOrder, loading: creatingOrder } = usePublicDeliveryOrder(establishmentId);
  const { calculateFee, loading: calculatingFee } = useDeliveryFeeCalculation(establishmentId);
  const { checkAvailability, loading: checkingAvailability } = useDeliveryAvailability(establishmentId);

  if (!establishmentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Estabelecimento não encontrado</h2>
          <p className="text-gray-600 mb-4">Por favor, acesse através do link correto.</p>
          <a href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const handleAddItem = () => {
    if (!newItem.productName || newItem.unitPrice <= 0 || newItem.quantity <= 0) {
      showToast('Preencha todos os campos do item', 'error');
      return;
    }

    setItems([
      ...items,
      {
        id: Date.now().toString(),
        ...newItem,
      },
    ]);

    setNewItem({
      productName: '',
      unitPrice: 0,
      quantity: 1,
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleCheckAvailability = async () => {
    if (!formData.deliveryNeighborhood || !formData.deliveryZipCode) {
      showToast('Preencha bairro e CEP', 'error');
      return;
    }

    try {
      const result = await checkAvailability({
        neighborhood: formData.deliveryNeighborhood,
        zipCode: formData.deliveryZipCode,
      });

      if (result.available) {
        setIsAvailable(true);
        showToast('Entrega disponível nesta região!', 'success');

        // Calcular taxa
        const feeResult = await calculateFee({
          neighborhood: formData.deliveryNeighborhood,
          zipCode: formData.deliveryZipCode,
          subtotal,
        });

        setDeliveryFee(feeResult.deliveryFee);
      } else {
        setIsAvailable(false);
        showToast(result.message || 'Entrega não disponível nesta região', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'Erro ao verificar disponibilidade', 'error');
    }
  };

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      showToast('Adicione pelo menos um item', 'error');
      return;
    }

    try {
      const order = await createOrder({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        deliveryAddress: formData.deliveryAddress,
        deliveryNeighborhood: formData.deliveryNeighborhood,
        deliveryCity: formData.deliveryCity,
        deliveryState: formData.deliveryState,
        deliveryZipCode: formData.deliveryZipCode,
        deliveryComplement: formData.deliveryComplement,
        deliveryReference: formData.deliveryReference,
        items: items.map(item => ({
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      });

      showToast('Pedido criado com sucesso!', 'success');
      router.push(`/delivery/${order.id}`);
    } catch (error: any) {
      showToast(error.message || 'Erro ao criar pedido', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Fazer Pedido</h1>
          <p className="text-gray-600 mt-2">Preencha os dados abaixo para fazer seu pedido</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            {(['address', 'items', 'payment', 'confirm'] as const).map((s, index) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step === s
                      ? 'bg-blue-600 text-white'
                      : ['address', 'items', 'payment', 'confirm'].indexOf(step) > index
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {['address', 'items', 'payment', 'confirm'].indexOf(step) > index ? '✓' : index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      ['address', 'items', 'payment', 'confirm'].indexOf(step) > index ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-600">
            <span>Endereço</span>
            <span>Itens</span>
            <span>Pagamento</span>
            <span>Confirmar</span>
          </div>
        </div>

        {/* Step: Address */}
        {step === 'address' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Dados de Entrega</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 98765-4321"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço *</label>
                <input
                  type="text"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rua, número"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                  <input
                    type="text"
                    value={formData.deliveryNeighborhood}
                    onChange={(e) => setFormData({ ...formData, deliveryNeighborhood: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bairro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                  <input
                    type="text"
                    value={formData.deliveryZipCode}
                    onChange={(e) => setFormData({ ...formData, deliveryZipCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="00000-000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                  <input
                    type="text"
                    value={formData.deliveryCity}
                    onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="São Paulo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                  <input
                    type="text"
                    value={formData.deliveryState}
                    onChange={(e) => setFormData({ ...formData, deliveryState: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                <input
                  type="text"
                  value={formData.deliveryComplement}
                  onChange={(e) => setFormData({ ...formData, deliveryComplement: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Apto, sala, etc"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referência</label>
                <input
                  type="text"
                  value={formData.deliveryReference}
                  onChange={(e) => setFormData({ ...formData, deliveryReference: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ponto de referência"
                />
              </div>

              <button
                onClick={handleCheckAvailability}
                disabled={checkingAvailability}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {checkingAvailability ? 'Verificando...' : 'Verificar Disponibilidade'}
              </button>

              {isAvailable && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-700">Entrega disponível nesta região!</span>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => router.push('/')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setStep('items')}
                disabled={!isAvailable}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* Step: Items */}
        {step === 'items' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Itens do Pedido</h2>

            {/* Add Item Form */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Adicionar Item</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Produto *</label>
                  <input
                    type="text"
                    value={newItem.productName}
                    onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome do produto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Unitário *</label>
                    <input
                      type="number"
                      value={newItem.unitPrice}
                      onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1"
                      min="1"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddItem}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Adicionar Item
                </button>
              </div>
            </div>

            {/* Items List */}
            {items.length > 0 ? (
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity}x {formatCurrency(item.unitPrice)} = {formatCurrency(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700 ml-4"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum item adicionado ainda</p>
              </div>
            )}

            {/* Summary */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-blue-200">
                <span>Total (sem entrega):</span>
                <span className="text-blue-600">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('address')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep('payment')}
                disabled={items.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === 'payment' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Forma de Pagamento</h2>

            <div className="space-y-3 mb-6">
              {Object.values(PaymentMethod).map((method) => (
                <label key={method} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 font-medium text-gray-900">
                    {method === PaymentMethod.PIX ? 'PIX' :
                     method === PaymentMethod.CREDIT_CARD ? 'Cartão de Crédito' :
                     method === PaymentMethod.DEBIT_CARD ? 'Cartão de Débito' :
                     method === PaymentMethod.CASH ? 'Dinheiro' : 'Transferência'}
                  </span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Alguma observação especial?"
                rows={4}
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep('items')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep('confirm')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Confirmar Pedido</h2>

            <div className="space-y-6">
              {/* Cliente */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cliente</h3>
                <p className="text-gray-700">{formData.customerName}</p>
                <p className="text-gray-600 text-sm">{formData.customerPhone}</p>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Endereço de Entrega</h3>
                <p className="text-gray-700">{formData.deliveryAddress}</p>
                <p className="text-gray-600 text-sm">
                  {formData.deliveryNeighborhood}, {formData.deliveryCity} - {formData.deliveryState}
                </p>
              </div>

              {/* Itens */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Itens</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-gray-700">
                      <span>{item.quantity}x {item.productName}</span>
                      <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Valores */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Taxa de Entrega:</span>
                  <span className="font-semibold">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-blue-200">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Pagamento */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Forma de Pagamento</h3>
                <p className="text-gray-700">
                  {formData.paymentMethod === PaymentMethod.PIX ? 'PIX' :
                   formData.paymentMethod === PaymentMethod.CREDIT_CARD ? 'Cartão de Crédito' :
                   formData.paymentMethod === PaymentMethod.DEBIT_CARD ? 'Cartão de Débito' :
                   formData.paymentMethod === PaymentMethod.CASH ? 'Dinheiro' : 'Transferência'}
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep('payment')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleSubmitOrder}
                disabled={creatingOrder}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {creatingOrder ? 'Criando pedido...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewDeliveryOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <NewDeliveryOrderContent />
    </Suspense>
  );
}
