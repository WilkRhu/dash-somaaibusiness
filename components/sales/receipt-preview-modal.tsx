'use client';

import { useState } from 'react';
import { salesApi } from '@/lib/api/sales';
import { DanfeSaleData } from '@/components/sales/danfe-preview';

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: DanfeSaleData;
  establishmentId?: string;
  saleId?: string;
}

export function ReceiptPreviewModal({
  isOpen,
  onClose,
  sale,
  establishmentId,
  saleId,
}: ReceiptPreviewModalProps) {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [showOptions, setShowOptions] = useState(true);
  const isFiscal = !!sale.fiscalNote?.accessKey;

  const handlePrint = () => {
    setShowOptions(false);
    setTimeout(() => window.print(), 100);
  };

  const handleSendEmail = async () => {
    if (!email || !establishmentId || !saleId) return;
    setEmailStatus('sending');
    try {
      await salesApi.sendReceipt(establishmentId, saleId, email);
      setEmailStatus('sent');
      setTimeout(() => onClose(), 1500);
    } catch {
      setEmailStatus('error');
    }
  };

  if (!isOpen) return null;

  if (showOptions) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Cupom da Venda</h3>
            <p className="text-sm text-gray-600">Como deseja receber o comprovante?</p>
          </div>

          {/* Opção Impressão */}
          <button
            onClick={handlePrint}
            className="w-full p-6 border-2 border-gray-300 rounded-xl hover:border-brand-blue hover:bg-blue-50 transition-all group mb-4"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">🖨️</div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Imprimir</p>
                <p className="text-xs text-gray-600">Imprimir o cupom agora</p>
              </div>
            </div>
          </button>

          {/* Opção Email */}
          <button
            onClick={() => setShowOptions(false)}
            className="w-full p-6 border-2 border-gray-300 rounded-xl hover:border-brand-green hover:bg-green-50 transition-all group mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📧</div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Enviar por Email</p>
                <p className="text-xs text-gray-600">Enviar comprovante para o cliente</p>
              </div>
            </div>
          </button>

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="w-full p-4 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Cupom */}
          <div
            id="danfe-print"
            style={{ fontFamily: 'monospace', padding: 16, border: '1px solid #ccc', background: '#fff', marginBottom: 16 }}
          >
            {/* Cabeçalho */}
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <strong>{sale.establishment.name}</strong>
              {sale.establishment.cnpj && <div>CNPJ: {sale.establishment.cnpj}</div>}
              {sale.establishment.address && <div>{sale.establishment.address}</div>}
              <div style={{ marginTop: 8, fontSize: 12 }}>
                {isFiscal ? '*** NOTA FISCAL ELETRÔNICA ***' : '*** CUPOM NÃO FISCAL ***'}
              </div>
            </div>

            <hr />

            {isFiscal && (
              <div style={{ fontSize: 11, marginBottom: 8 }}>
                <div>NF-e Nº {sale.fiscalNote!.number}</div>
                <div>Chave: {sale.fiscalNote!.accessKey}</div>
              </div>
            )}

            <div style={{ fontSize: 12, marginBottom: 8 }}>
              Venda: {sale.saleNumber} | {new Date(sale.createdAt).toLocaleString('pt-BR')}
            </div>

            <hr />

            {/* Itens */}
            <table style={{ width: '100%', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Produto</th>
                  <th style={{ textAlign: 'right' }}>Qtd</th>
                  <th style={{ textAlign: 'right' }}>Unit</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.productName}</td>
                    <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>R$ {Number(item.unitPrice).toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>R$ {Number(item.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr />

            {/* Totais */}
            <div style={{ fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>R$ {Number(sale.subtotal).toFixed(2)}</span>
              </div>
              {Number(sale.discount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'green' }}>
                  <span>Desconto</span>
                  <span>- R$ {Number(sale.discount).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 15 }}>
                <span>TOTAL</span>
                <span>R$ {Number(sale.total).toFixed(2)}</span>
              </div>
              <div style={{ marginTop: 4, fontSize: 12 }}>Pagamento: {sale.paymentMethod}</div>
            </div>

            {/* QR Code NF-e */}
            {sale.fiscalNote?.qrCode && (
              <>
                <hr />
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(sale.fiscalNote.qrCode)}&size=120x120`}
                    alt="QR Code NF-e"
                  />
                  <div style={{ fontSize: 10, marginTop: 4 }}>Consulte em nfce.fazenda.sp.gov.br</div>
                </div>
              </>
            )}

            {/* Link DANFE PDF */}
            {sale.fiscalNote?.danfeUrl && (
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <a href={sale.fiscalNote.danfeUrl} target="_blank" rel="noreferrer">
                  📄 Baixar DANFE (PDF)
                </a>
              </div>
            )}
          </div>

          {/* Envio por e-mail */}
          {establishmentId && saleId && (
            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold text-gray-600">Enviar cupom por e-mail</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailStatus('idle');
                  }}
                  placeholder="cliente@email.com"
                  disabled={emailStatus === 'sending' || emailStatus === 'sent'}
                  className="flex-1 px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
                />
                <button
                  onClick={handleSendEmail}
                  disabled={!email || emailStatus === 'sending' || emailStatus === 'sent'}
                  className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:bg-brand-navy transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {emailStatus === 'sending' ? '...' : emailStatus === 'sent' ? '✓ Enviado' : '📧 Enviar'}
                </button>
              </div>
              {emailStatus === 'error' && <p className="text-xs text-red-500">Erro ao enviar. Tente novamente.</p>}
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowOptions(true)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-sm"
            >
              ← Voltar
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
