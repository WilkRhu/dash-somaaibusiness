'use client';

import { useState, useEffect } from 'react';
import type { Customer, CustomerPurchase } from '@/lib/types/customer';
import { formatCurrency, formatCPF, formatPhone } from '@/lib/utils/format';

interface CustomerDetailsModalProps {
  customer: Customer;
  onClose: () => void;
  onAddPoints: (points: number) => Promise<void>;
  onRedeemPoints: (points: number) => Promise<void>;
  loadPurchaseHistory: (customerId: string) => Promise<CustomerPurchase[]>;
}

export function CustomerDetailsModal({
  customer,
  onClose,
  onAddPoints,
  onRedeemPoints,
  loadPurchaseHistory,
}: CustomerDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'purchases' | 'loyalty'>('info');
  const [purchases, setPurchases] = useState<CustomerPurchase[]>([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(false);
  const [pointsAmount, setPointsAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (activeTab === 'purchases') {
      loadPurchases();
    }
  }, [activeTab]);

  const loadPurchases = async () => {
    setIsLoadingPurchases(true);
    try {
      const data = await loadPurchaseHistory(customer.id);
      setPurchases(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setIsLoadingPurchases(false);
    }
  };

  const handleAddPoints = async () => {
    const points = parseInt(pointsAmount);
    if (!points || points <= 0) return;

    setIsProcessing(true);
    try {
      await onAddPoints(points);
      setPointsAmount('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRedeemPoints = async () => {
    const points = parseInt(pointsAmount);
    if (!points || points <= 0) return;

    if (points > customer.loyaltyPoints) {
      alert('Pontos insuficientes');
      return;
    }

    setIsProcessing(true);
    try {
      await onRedeemPoints(points);
      setPointsAmount('');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">{customer.name}</h2>
              <p className="text-gray-600 mt-1">{formatPhone(customer.phone)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'info'
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Informações
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'purchases'
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Histórico de Compras
            </button>
            <button
              onClick={() => setActiveTab('loyalty')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'loyalty'
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fidelidade
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900 mt-1">{customer.email || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">CPF</label>
                  <p className="text-gray-900 mt-1">{customer.cpf ? formatCPF(customer.cpf) : '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Data de Nascimento</label>
                  <p className="text-gray-900 mt-1">
                    {customer.birthDate ? new Date(customer.birthDate).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Cliente desde</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Gasto</p>
                  <p className="text-2xl font-bold text-brand-navy mt-1">
                    {formatCurrency(customer.totalSpent)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Compras</p>
                  <p className="text-2xl font-bold text-brand-navy mt-1">
                    {customer.purchaseCount}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pontos</p>
                  <p className="text-2xl font-bold text-brand-navy mt-1">
                    {customer.loyaltyPoints}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div>
              {isLoadingPurchases ? (
                <p className="text-center text-gray-500 py-8">Carregando...</p>
              ) : purchases.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhuma compra registrada</p>
              ) : (
                <div className="space-y-3">
                  {purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-brand-navy">{purchase.saleNumber}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDate(purchase.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-navy">
                            {formatCurrency(purchase.total)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 capitalize">
                            {purchase.paymentMethod.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'loyalty' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg">
                <p className="text-sm text-gray-700">Pontos Disponíveis</p>
                <p className="text-4xl font-bold text-brand-navy mt-2">
                  {customer.loyaltyPoints}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  1 ponto = R$ 10 em compras
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gerenciar Pontos
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={pointsAmount}
                      onChange={(e) => setPointsAmount(e.target.value)}
                      placeholder="Quantidade de pontos"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddPoints}
                    disabled={!pointsAmount || isProcessing}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Adicionar Pontos
                  </button>
                  <button
                    onClick={handleRedeemPoints}
                    disabled={!pointsAmount || isProcessing}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Resgatar Pontos
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
