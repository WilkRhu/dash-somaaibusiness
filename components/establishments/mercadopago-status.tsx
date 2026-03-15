'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface MercadoPagoIntegration {
  id: string;
  isActive: boolean;
  isVerified: boolean;
  merchantName?: string;
}

export function MercadoPagoStatus() {
  const [integration, setIntegration] = useState<MercadoPagoIntegration | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIntegration();
  }, []);

  const loadIntegration = async () => {
    try {
      const response = await fetch('/api/business/establishments/mercadopago/integration', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIntegration(data);
      }
    } catch (error) {
      console.error('Erro ao carregar integração:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!integration) {
    return (
      <Link href="/establishments/mercadopago">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:bg-yellow-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-yellow-900">Mercado Pago não configurado</p>
              <p className="text-sm text-yellow-800">Clique para configurar pagamentos</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href="/establishments/mercadopago">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✓</span>
          <div>
            <p className="font-semibold text-green-900">Mercado Pago Conectado</p>
            <p className="text-sm text-green-800">
              {integration.merchantName || 'Pronto para receber pagamentos'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
