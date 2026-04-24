import { useState } from 'react';
import { fiscalApi } from '@/lib/api/fiscal';
import { showToast } from '@/components/ui/toast';

export function useFiscalNote() {
  const [isEmitting, setIsEmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emitNote = async (establishmentId: string, saleId: string, saleData: any) => {
    setIsEmitting(true);
    setError(null);
    try {
      const response = await fiscalApi.emit({
        establishmentId,
        saleId,
        customerId: saleData.customerId,
        items: saleData.items.map((item: any) => ({
          productId: item.itemId,
          description: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        })),
        totalAmount: saleData.total,
        paymentMethod: saleData.paymentMethod,
        type: 'NFCE',
      });

      showToast('Nota fiscal em processamento...', 'info');
      return response;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao emitir nota fiscal';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      throw err;
    } finally {
      setIsEmitting(false);
    }
  };

  return { emitNote, isEmitting, error };
}
