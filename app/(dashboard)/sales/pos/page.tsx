'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';

export default function POSPage() {
  const [barcode, setBarcode] = useState('');
  const { items, total, clear } = useCartStore();

  return (
    <div className="grid grid-cols-2 gap-4 h-[calc(100vh-12rem)]">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-brand-navy">PDV - Ponto de Venda</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <input
            type="text"
            placeholder="Digite ou escaneie o código de barras"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Carrinho</h2>
        
        {items.length === 0 ? (
          <p className="text-gray-500">Carrinho vazio</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>R$ {item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-2xl font-bold">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button className="w-full px-4 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity text-lg font-semibold">
            Finalizar Venda
          </button>
          <button 
            onClick={clear}
            className="w-full px-4 py-2 border-2 border-brand-blue/30 text-brand-navy rounded-lg hover:bg-brand-blue/5 transition-colors font-medium"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}
