'use client';

import { useState, useEffect } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { showToast } from '@/components/ui/toast';
import apiClient from '@/lib/api/client';

interface MercadoPagoIntegration {
  id: string;
  establishmentId: string;
  isActive: boolean;
  isVerified: boolean;
  merchantName?: string;
  merchantEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MercadoPagoPage() {
  const { currentEstablishment } = useEstablishmentStore();
  const [integration, setIntegration] = useState<MercadoPagoIntegration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    accessToken: '',
    publicKey: '',
  });

  useEffect(() => {
    loadIntegration();
  }, [currentEstablishment?.id]);

  const loadIntegration = async () => {
    setIsLoading(true);
    try {
      if (!currentEstablishment) {
        showToast('Nenhum estabelecimento selecionado', 'error');
        return;
      }

      const response = await apiClient.get('/business/establishments/mercadopago/integration');
      
      if (response.data) {
        setIntegration(response.data);
        setShowForm(false);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setIntegration(null);
        setShowForm(true);
      } else {
        console.error('Erro ao carregar integração:', error);
        showToast('Erro ao carregar integração do Mercado Pago', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accessToken.trim() || !formData.publicKey.trim()) {
      showToast('Preencha todos os campos', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const response = await apiClient.post('/business/establishments/mercadopago/connect', {
        accessToken: formData.accessToken,
        publicKey: formData.publicKey,
      });

      setIntegration(response.data);
      setFormData({ accessToken: '', publicKey: '' });
      setShowForm(false);
      showToast('Mercado Pago conectado com sucesso!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao conectar Mercado Pago', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Tem certeza que deseja desconectar o Mercado Pago?')) {
      return;
    }

    setIsSaving(true);
    try {
      await apiClient.delete('/business/establishments/mercadopago/disconnect');
      setIntegration(null);
      setShowForm(true);
      showToast('Mercado Pago desconectado com sucesso!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao desconectar Mercado Pago', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Carregando integração...</p>
      </div>
    );
  }

  if (!currentEstablishment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Nenhum estabelecimento selecionado</p>
        <p className="text-sm text-gray-400">Selecione um estabelecimento no menu para configurar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Integração Mercado Pago</h1>
        <p className="text-gray-600 mt-2">Estabelecimento: {currentEstablishment.name}</p>
      </div>

      {/* Status */}
      {integration && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-green-900 mb-2">Mercado Pago Conectado</h2>
              <div className="space-y-2 text-sm text-green-800">
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="inline-block px-2 py-1 bg-green-100 rounded text-xs font-semibold">
                    {integration.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </p>
                {integration.merchantName && (
                  <p>
                    <strong>Loja:</strong> {integration.merchantName}
                  </p>
                )}
                {integration.merchantEmail && (
                  <p>
                    <strong>Email:</strong> {integration.merchantEmail}
                  </p>
                )}
                <p>
                  <strong>Conectado em:</strong> {new Date(integration.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de Conexão */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Conectar Mercado Pago</h2>
          <p className="text-sm text-gray-600 mb-6">
            Para conectar o Mercado Pago, você precisa das suas credenciais de desenvolvedor. 
            <a
              href="https://www.mercadopago.com.br/developers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              Obtenha suas credenciais aqui
            </a>
          </p>

          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token
              </label>
              <input
                type="password"
                value={formData.accessToken}
                onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                placeholder="APP_USR-..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Encontre em: Mercado Pago Developer → Credenciais → Access Token
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Key
              </label>
              <input
                type="password"
                value={formData.publicKey}
                onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
                placeholder="APP_USR-..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Encontre em: Mercado Pago Developer → Credenciais → Public Key
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              {integration && (
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
              >
                {isSaving ? 'Conectando...' : 'Conectar Mercado Pago'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ações */}
      {integration && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ações</h2>
          <div className="space-y-3">
            <button
              onClick={() => setShowForm(true)}
              className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Atualizar Credenciais
            </button>
            <button
              onClick={handleDisconnect}
              disabled={isSaving}
              className="w-full px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Desconectar Mercado Pago
            </button>
          </div>
        </div>
      )}

      {/* Guia Passo a Passo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-blue-900 mb-4">Guia: Como Obter Suas Credenciais</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-blue-900">Acesse o Mercado Pago Developer</p>
              <p className="text-sm text-blue-800 mt-1">
                Visite{' '}
                <a
                  href="https://www.mercadopago.com.br/developers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-700 font-semibold"
                >
                  www.mercadopago.com.br/developers
                </a>
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-blue-900">Faça login com sua conta</p>
              <p className="text-sm text-blue-800 mt-1">
                Use a mesma conta que você usa para receber pagamentos no Mercado Pago
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-blue-900">Vá para "Credenciais" ou "Aplicações"</p>
              <p className="text-sm text-blue-800 mt-1">
                No menu lateral, procure por "Credenciais", "Aplicações" ou "Integração"
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <p className="font-semibold text-blue-900">Copie suas credenciais</p>
              <div className="text-sm text-blue-800 mt-1 space-y-1">
                <p>• Access Token: Começa com "APP_USR-"</p>
                <p>• Public Key: Também começa com "APP_USR-"</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              5
            </div>
            <div>
              <p className="font-semibold text-blue-900">Cole as credenciais aqui</p>
              <p className="text-sm text-blue-800 mt-1">
                Volte para esta página e preencha o formulário com as credenciais copiadas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Segurança */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-yellow-900 mb-3">Segurança</h2>
        <ul className="text-sm text-yellow-800 space-y-2">
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Suas credenciais são armazenadas de forma criptografada</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Nunca compartilhamos suas credenciais com terceiros</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Use credenciais de produção apenas em ambiente de produção</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Para testes, use credenciais de sandbox do Mercado Pago</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
