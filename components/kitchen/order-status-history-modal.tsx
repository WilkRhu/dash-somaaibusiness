'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OrderStatusHistory from './order-status-history';

interface OrderStatusHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
}

export default function OrderStatusHistoryModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
}: OrderStatusHistoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Status - Pedido #{orderNumber}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <OrderStatusHistory orderId={orderId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
