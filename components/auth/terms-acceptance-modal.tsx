'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TermsAcceptanceModalProps {
  open: boolean;
  onAccept: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export function TermsAcceptanceModal({
  open,
  onAccept,
  onReject,
  isLoading = false,
}: TermsAcceptanceModalProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedPayment, setAcceptedPayment] = useState(false);

  const canAccept = acceptedTerms && acceptedPrivacy && acceptedPayment;

  const handleAccept = () => {
    if (canAccept) {
      onAccept();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-900">Termos e Condições</h2>
          <p className="text-sm text-slate-600 mt-2">
            Antes de continuar, você precisa aceitar nossos termos e políticas
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Aviso Importante */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Informação Importante</p>
              <p>
                Esta plataforma processa dados fiscais e pagamentos. Você é responsável por cumprir 
                com todas as obrigações legais e fiscais aplicáveis.
              </p>
            </div>
          </div>

          {/* Termos de Uso */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="flex-1 cursor-pointer">
                <span className="font-semibold text-slate-900">Aceito os Termos de Uso e Aceite</span>
                <p className="text-sm text-slate-600 font-normal mt-1">
                  Li e concordo com os{' '}
                  <Link
                    href="/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Termos de Uso e Aceite
                  </Link>
                  , incluindo responsabilidades fiscais, processamento de pagamentos e conformidade legal.
                </p>
              </label>
            </div>
          </div>

          {/* Política de Privacidade */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="privacy" className="flex-1 cursor-pointer">
                <span className="font-semibold text-slate-900">Aceito a Política de Privacidade</span>
                <p className="text-sm text-slate-600 font-normal mt-1">
                  Li e concordo com a{' '}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Política de Privacidade
                  </Link>
                  , incluindo coleta, uso e proteção de dados pessoais conforme LGPD.
                </p>
              </label>
            </div>
          </div>

          {/* Processamento de Pagamentos */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="payment"
                checked={acceptedPayment}
                onChange={(e) => setAcceptedPayment(e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="payment" className="flex-1 cursor-pointer">
                <span className="font-semibold text-slate-900">Autorizo Processamento de Pagamentos</span>
                <p className="text-sm text-slate-600 font-normal mt-1">
                  Autorizo a Plataforma a processar pagamentos através de provedores certificados 
                  (MercadoPago, bancos, etc.) e concordo com as políticas de segurança e reembolso.
                </p>
              </label>
            </div>
          </div>

          {/* Resumo de Responsabilidades */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-slate-900 text-sm">Você é responsável por:</p>
            <ul className="text-sm text-slate-700 space-y-1 ml-4">
              <li>• Cumprir com obrigações fiscais federais, estaduais e municipais</li>
              <li>• Manter certificados digitais (e-CNPJ) válidos e atualizados</li>
              <li>• Emitir documentos fiscais conforme exigido pela lei</li>
              <li>• Proteger suas credenciais de acesso</li>
              <li>• Usar a Plataforma apenas para fins legítimos</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 flex gap-3">
          <button
            onClick={onReject}
            disabled={isLoading}
            className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Recusar
          </button>
          <button
            onClick={handleAccept}
            disabled={!canAccept || isLoading}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processando...' : 'Aceitar e Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
}
