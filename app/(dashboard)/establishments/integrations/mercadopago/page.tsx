'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { mercadoPagoApi, MercadoPagoIntegration } from '@/lib/api/mercadopago';
import { showToast } from '@/components/ui/toast';

export default function MercadoPagoIntegrationPage() {
  const [integration, setIntegration] = useState<MercadoPagoIntegration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [form, setForm] = useState({ accessToken: '', publicKey: '' });

  useEffect(() => {
    fetchIntegration();
  }, []);

  const fetchIntegration = async () => {
    try {
      const data = await mercadoPagoApi.getIntegration();
      setIntegration(data);
    } catch {
      setIntegration(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await mercadoPagoApi.connectManual(form.accessToken, form.publicKey);
      setIntegration(data as MercadoPagoIntegration);
      setForm({ accessToken: '', publicKey: '' });
      showToast('Mercado Pago conectado com sucesso!', 'success');
    } catch (err: any) {
      const msg = err?.message || 'Credenciais inválidas. Verifique e tente novamente.';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Tem certeza que deseja desconectar o Mercado Pago?')) return;
    setDisconnecting(true);
    try {
      await mercadoPagoApi.disconnect();
      setIntegration(null);
      showToast('Mercado Pago desconectado.', 'success');
    } catch {
      showToast('Erro ao desconectar. Tente novamente.', 'error');
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/establishments/integrations" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#009EE3] flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
              <path d="M6 16c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="16" cy="20" r="3" fill="#fff" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mercado Pago</h1>
            <p className="text-sm text-gray-500">Pagamentos online para seu estabelecimento</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 flex justify-center">
          <div className="w-6 h-6 border-2 border-[#009EE3] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : integration?.isActive ? (
        /* Conectado */
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <span className="flex items-center gap-2 text-sm font-semibold text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Conectado
              </span>
            </div>
            {integration.merchantName && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Conta</span>
                <span className="text-sm text-gray-900">{integration.merchantName}</span>
              </div>
            )}
            {integration.merchantEmail && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="text-sm text-gray-900">{integration.merchantEmail}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Verificado</span>
              <span className={`text-sm font-medium ${integration.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                {integration.isVerified ? 'Sim' : 'Pendente'}
              </span>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
            Seu estabelecimento está pronto para receber pagamentos via PIX, cartão de crédito e débito.
          </div>

          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
          >
            {disconnecting ? 'Desconectando...' : 'Desconectar Mercado Pago'}
          </button>
        </div>
      ) : (
        /* Não conectado */
        <div className="space-y-4">
          {/* Passo a passo */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
            <p className="text-sm font-semibold text-blue-900">Como obter suas credenciais</p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Acesse <a href="https://www.mercadopago.com.br/developers/panel/app" target="_blank" rel="noopener noreferrer" className="underline font-medium">mercadopago.com.br/developers/panel/app</a></li>
              <li>Selecione sua aplicação (ou crie uma nova)</li>
              <li>Vá em <span className="font-medium">Credenciais de produção</span></li>
              <li>Copie o <span className="font-medium">Access Token</span> e a <span className="font-medium">Public Key</span></li>
              <li>Cole nos campos abaixo e clique em Salvar</li>
            </ol>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
              <input
                type="text"
                placeholder="APP_USR-..."
                value={form.accessToken}
                onChange={e => setForm(f => ({ ...f, accessToken: e.target.value }))}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009EE3]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Public Key</label>
              <input
                type="text"
                placeholder="APP_USR-..."
                value={form.publicKey}
                onChange={e => setForm(f => ({ ...f, publicKey: e.target.value }))}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009EE3]"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-3 bg-[#009EE3] hover:bg-[#0088cc] text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Salvando...</>
              ) : 'Salvar'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
