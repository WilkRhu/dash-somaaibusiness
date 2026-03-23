import { useEffect, useState } from 'react';
import { mercadoPagoApi, MercadoPagoIntegration } from '@/lib/api/mercadopago';

export function useMercadoPagoIntegration() {
  const [integration, setIntegration] = useState<MercadoPagoIntegration | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    mercadoPagoApi.getIntegration()
      .then(setIntegration)
      .catch(() => setIntegration(null))
      .finally(() => setChecked(true));
  }, []);

  return { integration, isConnected: !!(integration?.isActive || integration?.id), checked };
}
