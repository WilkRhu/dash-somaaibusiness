'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { PaymentMethod } from '@/lib/types/sale';
import { mercadoPagoApi } from '@/lib/api/mercadopago';
import { salesApi } from '@/lib/api/sales';
import { showToast } from '@/components/ui/toast';
import { DanfePreview, type DanfeSaleData } from '@/components/sales/danfe-preview';
import { ReceiptPreviewModal } from '@/components/sales/receipt-preview-modal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: PaymentMethod, cashRegisterId?: number, notes?: string, skipFinalize?: boolean) => Promise<{ id: string } | void>;
  onMpApproved?: () => void;
  total: number;
  items?: { name: string; quantity: number; unitPrice: number }[];
  maxCashRegisters?: number;
  isLoading?: boolean;
  hasMercadoPago?: boolean;
  establishmentId?: string;
  // dados para o cupom simulado
  saleNumber?: string;
  establishment?: { name: string; cnpj?: string; address?: string };
  discount?: number;
}

const paymentMethods = [
  {
    value: PaymentMethod.CASH,
    label: 'Dinheiro',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  },
  {
    value: PaymentMethod.PIX,
    label: 'PIX',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  },
  {
    value: PaymentMethod.DEBIT_CARD,
    label: 'Cartão de Débito',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  },
  {
    value: PaymentMethod.CREDIT_CARD,
    label: 'Cartão de Crédito',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  },
  {
    value: PaymentMethod.BANK_TRANSFER,
    label: 'Transferência',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  },
];

const POLL_INTERVAL = 3000;
const MAX_POLLS = 60;

export default function CheckoutModal({
  isOpen,
  onClose,
  onConfirm,
  onMpApproved,
  total,
  items = [],
  maxCashRegisters = 99,
  isLoading = false,
  hasMercadoPago = false,
  establishmentId = '',
  saleNumber,
  establishment = { name: 'Estabelecimento' },
  discount = 0,
}: CheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [cashRegisterId, setCashRegisterId] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [amountReceived, setAmountReceived] = useState<string>('');
  const [showNotes, setShowNotes] = useState(false);

  // Fase PIX
  const [phase, setPhase] = useState<'form' | 'pix-loading' | 'pix-qr' | 'pix-approved' | 'pix-rejected' | 'receipt'>('form');
  const [receiptData, setReceiptData] = useState<DanfeSaleData | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [pixData, setPixData] = useState<{ qrCodeBase64: string; qrCode: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentSaleId, setCurrentSaleId] = useState<string | null>(null);
  const approvedRef = useRef(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const change = selectedMethod === PaymentMethod.CASH && amountReceived
    ? Math.max(0, parseFloat(amountReceived) - total)
    : 0;

  const isMpPixMethod = hasMercadoPago && (
    selectedMethod === PaymentMethod.PIX ||
    selectedMethod === PaymentMethod.CREDIT_CARD ||
    selectedMethod === PaymentMethod.DEBIT_CARD
  );

  useEffect(() => {
    if (!isOpen) {
      setSelectedMethod(PaymentMethod.CASH);
      setAmountReceived('');
      setNotes('');
      setShowNotes(false);
      setPhase('form');
      setPixData(null);
      setCurrentSaleId(null);
      setReceiptData(null);
      setShowReceiptModal(false);
      approvedRef.current = false;
      stopPolling();
    }
  }, [isOpen]);

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
  };

  const buildReceiptData = (paymentLabel: string): DanfeSaleData => ({
    saleNumber: saleNumber ?? `#${Date.now()}`,
    createdAt: new Date().toISOString(),
    establishment,
    items: items.map((i) => ({
      productName: i.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      subtotal: i.quantity * i.unitPrice,
    })),
    subtotal: total + discount,
    discount,
    total,
    paymentMethod: paymentLabel,
  });

  const connectPaymentSocket = (saleId: string, saleTotal: number, saleItems: { name: string; quantity: number; price: number }[]) => {
    const apiUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userId = typeof window !== 'undefined' ? (localStorage.getItem('userId') || 'anonymous') : 'anonymous';

    const socket = io(`${apiUrl}/scanner`, {
      transports: ['websocket', 'polling'],
      auth: token ? { token } : undefined,
      query: { type: 'dashboard', userId },
    });

    socket.on('connect', () => {
      console.log('[PIX] Socket conectado, aguardando pix-payment-confirmed para saleId:', saleId);
    });

    socket.on('connect_error', (err) => {
      console.error('[PIX] Socket erro de conexão:', err.message);
    });

    socket.on('pix-payment-confirmed', (data: { saleId: string; mercadoPagoPaymentId?: string; status?: string; timestamp?: string }) => {
      console.log('[PIX] pix-payment-confirmed recebido:', data, '| esperado saleId:', saleId);
      // Proteção contra eventos duplicados: verifica se já foi processado
      if (data.saleId === saleId && !approvedRef.current) {
        approvedRef.current = true;
        // Desconecta o socket imediatamente para evitar receber o evento novamente
        socket.off('pix-payment-confirmed');
        socket.disconnect();
        
        socket.emit('sale-completed', { saleId, total: saleTotal, items: saleItems });

        stopPolling();
        setPhase('pix-approved');
        showToast('Pagamento aprovado!', 'success');
        
        setTimeout(() => {
          onMpApproved?.();
          setReceiptData(buildReceiptData('PIX (Mercado Pago)'));
          setShowReceiptModal(true);
          setPhase('form');
        }, 1500);
      }
    });

    socket.on('sale-completed-error', (data: { message: string }) => {
      console.error('[PIX] sale-completed-error:', data.message);
      showToast('Aguarde a confirmação do pagamento', 'warning');
    });

    socketRef.current = socket;
  };

  const startPolling = (saleId: string) => {
    let count = 0;

    const check = async () => {
      count++;
      if (count > MAX_POLLS) { stopPolling(); return; }
      try {
        const sale = await salesApi.getById(establishmentId, saleId);
        const status = ((sale as any).status ?? (sale as any).data?.status ?? '').toLowerCase();
        if (status === 'completed') {
          if (approvedRef.current) return;
          approvedRef.current = true;
          stopPolling();
          setPhase('pix-approved');
          showToast('Pagamento aprovado!', 'success');
          setTimeout(() => {
            onMpApproved?.();
            setReceiptData(buildReceiptData('PIX (Mercado Pago)'));
            setPhase('receipt');
          }, 1500);
        } else if (status === 'cancelled') {
          stopPolling();
          setPhase('pix-rejected');
        }
      } catch { /* ignora */ }
    };

    // Aguarda 5s antes do primeiro poll — a venda recém-criada ainda não foi paga
    pollRef.current = setInterval(check, POLL_INTERVAL);
  };

  const handleConfirm = async () => {
    if (cashRegisterId < 1 || cashRegisterId > maxCashRegisters) {
      alert(`Número do caixa deve estar entre 1 e ${maxCashRegisters}`);
      return;
    }
    if (selectedMethod === PaymentMethod.CASH) {
      const received = parseFloat(amountReceived);
      if (!amountReceived || isNaN(received) || received < total) {
        alert('O valor recebido deve ser maior ou igual ao total da venda');
        return;
      }
    }

    if (isMpPixMethod) {
      setPhase('pix-loading');
      try {
        // 1. Cria a venda
        const result = await onConfirm(selectedMethod, cashRegisterId, notes || undefined, true);
        const saleId = (result as any)?.id;
        if (!saleId) throw new Error('Venda não retornou ID');
        setCurrentSaleId(saleId);

        // 2. Gera PIX
        const pix = await mercadoPagoApi.generatePix({ saleId, totalAmount: total });
        setPixData({ qrCodeBase64: pix.qrCodeBase64, qrCode: pix.qrCode });
        setPhase('pix-qr');

        // 3. Conecta socket para aguardar pix-payment-confirmed
        const socketItems = items.map(i => ({ name: i.name, quantity: i.quantity, price: i.unitPrice }));
        connectPaymentSocket(saleId, total, socketItems);
      } catch (err: any) {
        showToast(err.message || 'Erro ao gerar PIX', 'error');
        setPhase('form');
      }
      return;
    }

    onConfirm(selectedMethod, cashRegisterId, notes || undefined).then((result) => {
      if (result?.id) {
        setCurrentSaleId(result.id);
      }
    });
    const label = paymentMethods.find((m) => m.value === selectedMethod)?.label ?? selectedMethod;
    setReceiptData(buildReceiptData(label));
    setShowReceiptModal(true);
  };

  const handleRetryPix = async () => {
    if (!currentSaleId) return;
    approvedRef.current = false;
    setPhase('pix-loading');
    try {
      const pix = await mercadoPagoApi.generatePix({ saleId: currentSaleId, totalAmount: total });
      setPixData({ qrCodeBase64: pix.qrCodeBase64, qrCode: pix.qrCode });
      setPhase('pix-qr');
      const socketItems = items.map(i => ({ name: i.name, quantity: i.quantity, price: i.unitPrice }));
      connectPaymentSocket(currentSaleId, total, socketItems);
    } catch (err: any) {
      showToast(err.message || 'Erro ao gerar PIX', 'error');
      setPhase('form');
    }
  };

  const handleCopy = () => {
    if (!pixData?.qrCode) return;
    navigator.clipboard.writeText(pixData.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickAmounts = [
    total,
    Math.ceil(total / 10) * 10,
    Math.ceil(total / 20) * 20,
    Math.ceil(total / 50) * 50,
  ].filter((v, i, arr) => arr.indexOf(v) === i && v >= total);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-brand-blue to-brand-green p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {phase === 'form' ? 'Finalizar Venda' : phase === 'receipt' ? 'Cupom da Venda' : 'Pagamento via PIX'}
            </h2>
            <button onClick={onClose} disabled={isLoading || phase === 'pix-loading' || showReceiptModal} className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-white/80 mb-1">Total a pagar</p>
            <p className="text-4xl font-bold">R$ {total.toFixed(2)}</p>
          </div>
        </div>

        {/* Fase PIX */}
        {phase !== 'form' ? (
          <div className="p-6 flex flex-col items-center gap-6">
            {phase === 'pix-loading' && (
              <>
                <div className="w-10 h-10 border-2 border-[#009EE3] border-t-transparent rounded-full animate-spin mt-8" />
                <p className="text-gray-500">Gerando PIX...</p>
              </>
            )}

            {phase === 'pix-approved' && (
              <>
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-green-700">Pagamento aprovado!</p>
              </>
            )}

            {phase === 'pix-rejected' && (
              <>
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-red-700">Pagamento cancelado</p>
                <button onClick={handleRetryPix} className="px-6 py-2 bg-[#009EE3] text-white rounded-xl font-medium hover:bg-[#0088cc] transition-colors">
                  Gerar novo PIX
                </button>
              </>
            )}

            {phase === 'pix-qr' && pixData && (
              <>
                <img
                  src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                  alt="QR Code PIX"
                  className="w-56 h-56 border border-gray-200 rounded-xl"
                />
                <div className="w-full space-y-2">
                  <p className="text-xs text-gray-500 text-center">ou use o código copia e cola</p>
                  <div className="flex gap-2">
                    <input readOnly value={pixData.qrCode} className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 truncate" />
                    <button onClick={handleCopy} className="px-3 py-2 bg-[#009EE3] text-white rounded-lg text-xs font-medium hover:bg-[#0088cc] transition-colors whitespace-nowrap">
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-3 h-3 border-2 border-[#009EE3] border-t-transparent rounded-full animate-spin" />
                  Aguardando pagamento...
                </div>
              </>
            )}
          </div>
        ) : (
          /* Fase formulário */
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Forma de Pagamento</label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setSelectedMethod(method.value)}
                    disabled={isLoading}
                    className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
                      selectedMethod === method.value
                        ? 'border-brand-blue bg-gradient-to-br from-brand-blue/10 to-brand-green/10 shadow-md'
                        : 'border-gray-200 hover:border-brand-blue/50 hover:shadow'
                    }`}
                  >
                    <div className={`flex justify-center mb-2 transition-colors ${selectedMethod === method.value ? 'text-brand-blue' : 'text-gray-400'}`}>
                      {method.icon}
                    </div>
                    <div className={`text-xs font-medium ${selectedMethod === method.value ? 'text-brand-navy' : 'text-gray-600'}`}>
                      {method.label}
                    </div>
                    {hasMercadoPago && (method.value === PaymentMethod.PIX || method.value === PaymentMethod.CREDIT_CARD || method.value === PaymentMethod.DEBIT_CARD) && (
                      <div className="text-[9px] text-[#009EE3] mt-1 font-medium">via MP</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedMethod === PaymentMethod.CASH && (
              <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Valor Recebido</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                    <input
                      type="number" step="0.01" min={total}
                      value={amountReceived} onChange={(e) => setAmountReceived(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-12 pr-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
                      placeholder="0,00"
                    />
                  </div>
                </div>
                {quickAmounts.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Valores rápidos</p>
                    <div className="flex flex-wrap gap-2">
                      {quickAmounts.map((amount) => (
                        <button key={amount} onClick={() => setAmountReceived(amount.toFixed(2))} disabled={isLoading}
                          className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-brand-blue hover:text-brand-blue transition-colors disabled:opacity-50">
                          R$ {amount.toFixed(2)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {amountReceived && parseFloat(amountReceived) >= total && (
                  <div className="bg-gradient-to-r from-brand-green to-emerald-500 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/90 mb-1">Troco a devolver</p>
                        <p className="text-3xl font-bold">R$ {change.toFixed(2)}</p>
                      </div>
                      <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Número do Caixa</label>
              <input type="number" min="1" max={maxCashRegisters} value={cashRegisterId}
                onChange={(e) => setCashRegisterId(parseInt(e.target.value) || 1)} disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
                placeholder="Ex: 1"
              />
              <p className="text-xs text-gray-500 mt-1">Caixas disponíveis: 1 a {maxCashRegisters}</p>
            </div>

            <div>
              <button onClick={() => setShowNotes(!showNotes)} disabled={isLoading}
                className="flex items-center gap-2 text-sm font-medium text-brand-blue hover:text-brand-navy transition-colors disabled:opacity-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {showNotes ? 'Ocultar observações' : 'Adicionar observações'}
              </button>
              {showNotes && (
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={isLoading}
                  placeholder="Adicione observações sobre a venda..."
                  className="w-full mt-3 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
                  rows={3}
                />
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        {phase === 'form' && (
          <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 flex gap-3">
            <button onClick={onClose} disabled={isLoading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50">
              Cancelar
            </button>
            <button onClick={handleConfirm} disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 transform hover:scale-105">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isMpPixMethod ? 'Gerar PIX' : 'Confirmar Venda'}
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">F2</span>
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>

    {receiptData && (
      <ReceiptPreviewModal
        isOpen={showReceiptModal}
        onClose={() => {
          setShowReceiptModal(false);
          onClose();
        }}
        sale={receiptData}
        establishmentId={establishmentId}
        saleId={currentSaleId ?? undefined}
      />
    )}
    </>
  );
}
