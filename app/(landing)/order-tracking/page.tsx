'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderTrackingSearchPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!orderNumber.trim()) {
      setError('Digite o número do pedido');
      return;
    }

    setLoading(true);
    try {
      // Validar se o pedido existe
      const response = await fetch(`/api/kitchen-orders/search?orderNumber=${orderNumber}`);
      
      if (response.ok) {
        router.push(`/order-tracking/${orderNumber}`);
      } else if (response.status === 404) {
        setError('Pedido não encontrado');
      } else {
        // Mesmo que o backend não esteja pronto, permite acessar a página
        router.push(`/order-tracking/${orderNumber}`);
      }
    } catch (err) {
      // Permite acessar mesmo com erro de conexão
      router.push(`/order-tracking/${orderNumber}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🍔</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Acompanhe seu Pedido</h1>
          <p className="text-gray-400 text-lg">Digite o número do seu pedido para acompanhar em tempo real</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input */}
          <div>
            <label className="block text-white text-lg font-semibold mb-3">Número do Pedido</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => {
                setOrderNumber(e.target.value.toUpperCase());
                setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="Ex: 001, 042, ABC123"
              className="w-full px-6 py-4 text-2xl font-bold text-center rounded-2xl bg-gray-700 text-white placeholder-gray-500 border-2 border-gray-600 focus:border-yellow-400 focus:outline-none transition-colors"
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-4">
              <p className="text-red-300 font-semibold text-center">{error}</p>
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-black text-xl py-4 rounded-2xl transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
          >
            {loading ? '⏳ Buscando...' : '🔍 Acompanhar Pedido'}
          </button>
        </form>

        {/* Dicas */}
        <div className="mt-12 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm font-semibold mb-3">💡 DICAS:</p>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• O número do pedido está no seu comprovante</li>
            <li>• Você pode acompanhar em tempo real</li>
            <li>• A página atualiza automaticamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
