'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useUIStore } from '@/lib/stores/ui-store';
import apiClient from '@/lib/api/client';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  amount: number;
  paymentMethod: 'pix' | 'card';
}

export function CheckoutModal({
  isOpen,
  onClose,
  planId,
  planName,
  amount,
  paymentMethod,
}: CheckoutModalProps) {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [cpf, setCpf] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    email: user?.email || '',
  });
  const [installments, setInstallments] = useState(1);
  const [installmentsOptions, setInstallmentsOptions] = useState<any[]>([]);
  const [mp, setMp] = useState<any>(null);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && !mp) {
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        const mercadopago = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY);
        setMp(mercadopago);
      };
      document.body.appendChild(script);
    }
  }, [isOpen]);

  useEffect(() => {
    // Removido: não gerar PIX automaticamente
  }, [isOpen, paymentMethod]);

  useEffect(() => {
    if (isOpen && paymentMethod === 'card') {
      fetchInstallments();
    }
  }, [isOpen, paymentMethod, amount]);

  useEffect(() => {
    if (!pixData?.paymentId) return;

    const interval = setInterval(async () => {
      try {
        const response = await apiClient.get(`/payments/pix/${pixData.paymentId}/status`);
        
        if (response.data.status === 'approved') {
          clearInterval(interval);
          addToast({ message: 'Pagamento aprovado! Seu plano foi ativado.', type: 'success' });
          setTimeout(() => window.location.reload(), 2000);
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pixData]);

  const generatePix = async () => {
    if (!user?.id) {
      addToast({ message: 'Usuário não autenticado', type: 'error' });
      return;
    }

    if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
      addToast({ message: 'CPF inválido', type: 'error' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiClient.post('/payments/pix/generate', {
        amount,
        orderId: `order-${Date.now()}`,
        userEmail: user.email,
        userId: user.id,
        planId: planId.toLowerCase(),
        description: `Assinatura ${planName} - SomaAI Business`,
        payerCpf: cpf.replace(/\D/g, ''),
      });

      const data = response.data;
      
      if (data.qrCode && data.copyKey && data.paymentId) {
        setPixData(data);
      } else {
        addToast({ message: 'Erro ao gerar PIX', type: 'error' });
      }
    } catch (error: any) {
      console.error('Erro ao gerar PIX:', error);
      const errorMessage = error?.response?.data?.message || 'Erro ao gerar código PIX';
      addToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchInstallments = async () => {
    try {
      const response = await apiClient.get(`/payments/installments?amount=${amount}`);
      const options = response.data.installmentOptions || [];
      
      if (options.length === 0) {
        addToast({ message: 'Nenhuma opção de parcelamento disponível', type: 'error' });
      }
      
      setInstallmentsOptions(options);
    } catch (error) {
      console.error('Erro ao buscar parcelas:', error);
      addToast({ message: 'Erro ao carregar opções de parcelamento', type: 'error' });
      setInstallmentsOptions([]);
    }
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
      addToast({ message: 'CPF inválido', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const expiryParts = cardData.expiry.split('/');
      const expirationMonth = expiryParts[0]?.trim();
      const expirationYear = expiryParts[1]?.trim();

      if (!expirationMonth || !expirationYear || expirationMonth.length !== 2 || expirationYear.length !== 2) {
        addToast({ message: 'Data de validade inválida. Use o formato MM/AA', type: 'error' });
        setLoading(false);
        return;
      }

      console.log('Dados do cartão antes de tokenizar:', {
        cardNumber: cardData.number.replace(/\s/g, ''),
        cardExpirationMonth: expirationMonth,
        cardExpirationYear: expirationYear,
        securityCode: cardData.cvv,
        cardholderName: cardData.name,
        cpf: cpf.replace(/\D/g, ''),
      });

      // Passo 1: Tokenizar o cartão no backend
      const tokenResponse = await apiClient.post('/payments/tokenize-card', {
        cardNumber: cardData.number.replace(/\s/g, ''),
        cardExpirationMonth: expirationMonth,
        cardExpirationYear: expirationYear,
        securityCode: cardData.cvv,
        cardholder: {
          name: cardData.name,
          identification: {
            type: 'CPF',
            number: cpf.replace(/\D/g, ''),
          },
        },
      });

      console.log('Resposta completa do tokenize:', tokenResponse.data);

      const token = tokenResponse.data.token || tokenResponse.data.id;
      const bin = tokenResponse.data.bin || tokenResponse.data.first_six_digits;
      let paymentMethodId = tokenResponse.data.paymentMethodId || tokenResponse.data.payment_method_id;
      const issuerId = tokenResponse.data.issuerId || tokenResponse.data.issuer_id;

      // Se não veio do backend, detectar pela bandeira do cartão
      if (!paymentMethodId) {
        paymentMethodId = getCardBrand(cardData.number);
        console.log('Bandeira detectada no frontend:', paymentMethodId);
      }

      console.log('Token recebido:', { token, bin, paymentMethodId, issuerId });

      // Se não veio issuerId do backend e é Mastercard, usar fallback
      let finalIssuerId = issuerId;
      if (!finalIssuerId && paymentMethodId === 'master') {
        finalIssuerId = '25'; // Fallback para Mastercard
        console.log('IssuerId não retornado, usando fallback para Mastercard:', finalIssuerId);
      }

      // Obter taxa de juros da parcela selecionada
      const selectedInstallment = installmentsOptions.find(opt => opt.installments === installments);
      const interestRate = selectedInstallment?.installmentRate || 0;

      // Passo 2: Processar pagamento com o token
      const paymentData = {
        amount,
        orderId: `order-${Date.now()}`,
        userEmail: user.email,
        userId: user.id,
        planId: planId.toLowerCase(),
        description: `Assinatura do plano ${planName}`,
        token,
        paymentMethodId,
        issuerId: finalIssuerId,
        bin: bin || undefined,
        installments,
        interestRate,
        expirationMonth,
        expirationYear,
      };

      console.log('Enviando pagamento:', paymentData);

      const response = await apiClient.post('/payments/credit-card/process', paymentData);

      if (response.data.status === 'approved') {
        addToast({ message: 'Pagamento aprovado! Seu plano foi ativado.', type: 'success' });
        setTimeout(() => window.location.reload(), 2000);
      } else {
        addToast({ message: 'Pagamento não aprovado. Verifique os dados do cartão.', type: 'error' });
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      const errorMessage = error?.response?.data?.message || 'Erro ao processar pagamento';
      addToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    if (pixData?.copyKey) {
      navigator.clipboard.writeText(pixData.copyKey);
      addToast({ message: 'Código PIX copiado!', type: 'success' });
    }
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  const getCardBrand = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s/g, '');
    const firstDigit = number[0];
    const firstTwo = number.substring(0, 2);
    const firstFour = number.substring(0, 4);

    if (firstDigit === '4') return 'visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwo) || (parseInt(firstFour) >= 2221 && parseInt(firstFour) <= 2720)) return 'master';
    if (['34', '37'].includes(firstTwo)) return 'amex';
    if (['6011', '6221', '6229', '6277', '6278'].some(prefix => firstFour.startsWith(prefix))) return 'discover';
    if (['636368', '438935', '504175', '451416', '509048', '509067', '509049', '627780'].some(prefix => number.startsWith(prefix))) return 'elo';
    if (firstFour === '6062') return 'hipercard';
    
    return 'visa'; // fallback
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-navy">
            {paymentMethod === 'pix' ? 'Pagamento via PIX' : 'Pagamento com Cartão'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={loading}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-gradient-to-r from-brand-blue to-brand-green rounded-lg p-4 text-white text-center mb-6">
          <p className="text-sm opacity-90 mb-1">Plano {planName}</p>
          <p className="text-3xl font-bold">R$ {amount.toFixed(2)}</p>
          <p className="text-sm opacity-90 mt-1">/mês</p>
        </div>

        {paymentMethod === 'pix' ? (
          loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Gerando código PIX...</p>
            </div>
          ) : pixData ? (
            <div className="space-y-4">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <img
                  src={`data:image/png;base64,${pixData.qrCode}`}
                  alt="QR Code PIX"
                  className="w-full max-w-xs mx-auto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código PIX Copia e Cola
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pixData.copyKey}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={copyPixCode}
                    className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:opacity-90"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-blue"></div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Aguardando pagamento...</p>
                    <p>Abra o app do seu banco e pague o PIX para ativar seu plano.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  required
                />
              </div>
              <button
                onClick={generatePix}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Gerar PIX
              </button>
            </div>
          )
        ) : (
          <form onSubmit={handleCardPayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                placeholder="000.000.000-00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número do Cartão</label>
              <input
                type="text"
                value={cardData.number}
                onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                placeholder="0000 0000 0000 0000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome no Cartão</label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                placeholder="NOME COMPLETO"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Validade</label>
                <input
                  type="text"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                  placeholder="MM/AA"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  placeholder="123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={cardData.email}
                onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parcelas</label>
              <select
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                {installmentsOptions.length > 0 ? (
                  installmentsOptions.map((option) => (
                    <option key={option.installments} value={option.installments}>
                      {option.recommendedMessage}
                    </option>
                  ))
                ) : (
                  <option value={1}>Carregando...</option>
                )}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Pagar Agora'}
            </button>
          </form>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Pagamento 100% seguro via Mercado Pago</span>
        </div>
      </div>
    </div>
  );
}
