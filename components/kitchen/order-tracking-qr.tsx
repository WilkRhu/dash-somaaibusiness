'use client';

import { KitchenOrder } from '@/lib/types/kitchen-order';
import { useEffect, useState } from 'react';

interface OrderTrackingQRProps {
  order: KitchenOrder;
  establishmentId: string;
}

export function OrderTrackingQR({ order, establishmentId }: OrderTrackingQRProps) {
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    // Gerar URL de rastreamento
    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order-tracking/${order.orderNumber}`;

    // Usar API QR Code gratuita
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(trackingUrl)}`;
    setQrCode(qrUrl);
  }, [order.orderNumber]);

  const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order-tracking/${order.orderNumber}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
      <h3 className="font-bold text-lg text-gray-900 mb-4">Acompanhe seu Pedido</h3>

      {qrCode && (
        <div className="mb-4 flex justify-center">
          <img src={qrCode} alt="QR Code" className="w-48 h-48 border-2 border-gray-200 rounded-lg" />
        </div>
      )}

      <p className="text-sm text-gray-600 mb-3">Escaneie o código QR ou acesse:</p>
      <p className="text-xs text-blue-600 break-all font-mono bg-gray-50 p-3 rounded-lg">{trackingUrl}</p>

      <p className="text-xs text-gray-500 mt-4">Número do pedido: <span className="font-bold text-lg">{order.orderNumber}</span></p>
    </div>
  );
}
