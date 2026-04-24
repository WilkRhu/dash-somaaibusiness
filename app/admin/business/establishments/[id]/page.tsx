'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  superAdminEstablishmentsApi,
  SuperAdminEstablishment,
  SuperAdminFiscalConfigDto,
  SuperAdminMercadoPagoConnectDto,
} from '@/lib/api/super-admin-establishments';
import { UpdateLoyaltySettingsDto } from '@/lib/types/establishment';

const establishmentTypes = [
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'bar', label: 'Bar' },
  { value: 'lanchonete', label: 'Lanchonete' },
  { value: 'padaria', label: 'Padaria' },
  { value: 'mercado', label: 'Mercado' },
  { value: 'farmacia', label: 'Farmácia' },
  { value: 'outro', label: 'Outro' },
];

type FiscalState = {
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  regimeTributario: string;
  cnae: string;
  crt: string;
  autoIssueFiscalNote: boolean;
  fiscalProvider: string;
  fiscalEnvironment: string;
};

type MpState = {
  accessToken: string;
  publicKey: string;
};

export default function EstablishmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [establishment, setEstablishment] = useState<SuperAdminEstablishment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: '',
    cnpj: '',
    type: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    description: '',
    cashRegistersCount: 0,
    isActive: true,
  });
  const [loyalty, setLoyalty] = useState<UpdateLoyaltySettingsDto>({
    loyaltyEnabled: false,
    loyaltyPointsPerReal: 0,
  });
  const [fiscal, setFiscal] = useState<FiscalState>({
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    regimeTributario: '',
    cnae: '',
    crt: '',
    autoIssueFiscalNote: false,
    fiscalProvider: '',
    fiscalEnvironment: '',
  });
  const [mercadoPago, setMercadoPago] = useState<MpState>({
    accessToken: '',
    publicKey: '',
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await superAdminEstablishmentsApi.getById(id);
        setEstablishment(data);
        setForm({
          name: data.name || '',
          cnpj: data.cnpj || '',
          type: data.type || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
          description: data.description || '',
          cashRegistersCount: data.cashRegistersCount || 0,
          isActive: data.isActive ?? true,
        });

        try {
          const loyaltyData = await superAdminEstablishmentsApi.getLoyaltySettings(id);
          setLoyalty({
            loyaltyEnabled: loyaltyData.loyaltyEnabled,
            loyaltyPointsPerReal: loyaltyData.loyaltyPointsPerReal,
          });
        } catch {
          setLoyalty({ loyaltyEnabled: false, loyaltyPointsPerReal: 0 });
        }

        try {
          const fiscalData = await superAdminEstablishmentsApi.getFiscalConfig(id);
          setFiscal({
            inscricaoEstadual: String(fiscalData.inscricaoEstadual || ''),
            inscricaoMunicipal: String(fiscalData.inscricaoMunicipal || ''),
            regimeTributario: String(fiscalData.regimeTributario || ''),
            cnae: String(fiscalData.cnae || ''),
            crt: String(fiscalData.crt || ''),
            autoIssueFiscalNote: Boolean(fiscalData.autoIssueFiscalNote),
            fiscalProvider: String(fiscalData.fiscalProvider || ''),
            fiscalEnvironment: String(fiscalData.fiscalEnvironment || ''),
          });
        } catch {
          setFiscal({
            inscricaoEstadual: '',
            inscricaoMunicipal: '',
            regimeTributario: '',
            cnae: '',
            crt: '',
            autoIssueFiscalNote: false,
            fiscalProvider: '',
            fiscalEnvironment: '',
          });
        }

        try {
          const mpData = await superAdminEstablishmentsApi.getMercadoPagoIntegration(id);
          setMercadoPago({
            accessToken: String(mpData.accessToken || ''),
            publicKey: String(mpData.publicKey || ''),
          });
        } catch {
          setMercadoPago({ accessToken: '', publicKey: '' });
        }

        setError(null);
      } catch {
        setError('Erro ao carregar estabelecimento');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getTypeLabel = (type: string) =>
    establishmentTypes.find((item) => item.value === type)?.label || type || '-';

  const handleSave = async () => {
    if (!establishment) return;
    try {
      setSaving(true);
      setMessage(null);
      await superAdminEstablishmentsApi.update(establishment.id, {
        ...form,
      });
      const updated = await superAdminEstablishmentsApi.getById(establishment.id);
      setEstablishment(updated);
      setMessage('Estabelecimento atualizado com sucesso.');
    } catch {
      setError('Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLoyalty = async () => {
    if (!establishment) return;
    try {
      setSaving(true);
      setMessage(null);
      await superAdminEstablishmentsApi.updateLoyaltySettings(establishment.id, loyalty);
      setMessage('Configuração de fidelidade atualizada.');
    } catch {
      setError('Erro ao atualizar fidelidade.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFiscal = async () => {
    if (!establishment) return;
    try {
      setSaving(true);
      setMessage(null);
      await superAdminEstablishmentsApi.updateFiscalConfig(establishment.id, fiscal as SuperAdminFiscalConfigDto);
      setMessage('Configuração fiscal atualizada.');
    } catch {
      setError('Erro ao atualizar fiscal.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMercadoPago = async () => {
    if (!establishment) return;
    try {
      setSaving(true);
      setMessage(null);
      await superAdminEstablishmentsApi.connectMercadoPago(establishment.id, mercadoPago as SuperAdminMercadoPagoConnectDto);
      setMessage('Mercado Pago conectado/atualizado.');
    } catch {
      setError('Erro ao conectar Mercado Pago.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!establishment) return;
    const confirmed = window.confirm(`Excluir definitivamente ${establishment.name}?`);
    if (!confirmed) return;

    try {
      setSaving(true);
      await superAdminEstablishmentsApi.delete(establishment.id);
      router.push('/admin/business/establishments');
    } catch {
      setError('Erro ao excluir estabelecimento.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!establishment || !logoFile) return;
    try {
      setSaving(true);
      setMessage(null);
      await superAdminEstablishmentsApi.uploadLogo(establishment.id, logoFile);
      const updated = await superAdminEstablishmentsApi.getById(establishment.id);
      setEstablishment(updated);
      setLogoFile(null);
      setMessage('Logo atualizada com sucesso.');
    } catch {
      setError('Erro ao enviar logo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Carregando estabelecimento...</div>;
  }

  if (error && !establishment) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      </div>
    );
  }

  if (!establishment) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/business/establishments" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-2xl bg-gray-100">
              {establishment.logo ? (
                <Image src={establishment.logo} alt={establishment.name} width={80} height={80} className="h-full w-full object-cover" unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">Super Admin</p>
              <h1 className="text-3xl font-bold text-gray-900">{establishment.name}</h1>
              <p className="mt-2 text-sm text-gray-600">{establishment.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${establishment.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {establishment.isActive ? 'Ativo' : 'Inativo'}
                </span>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                  {getTypeLabel(establishment.type)}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  CNPJ {establishment.cnpj}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:w-[360px]">
            <Link href={`/admin/business/establishments/${establishment.id}/inventory`} className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-800 hover:bg-gray-50">Inventário</Link>
            <Link href={`/admin/business/establishments/${establishment.id}/members`} className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-800 hover:bg-gray-50">Membros</Link>
            <Link href={`/admin/business/establishments/${establishment.id}/sales`} className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-800 hover:bg-gray-50">Vendas</Link>
            <Link href={`/admin/business/establishments/${establishment.id}/reports`} className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-800 hover:bg-gray-50">Relatórios</Link>
          </div>
        </div>
      </div>

      {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">{message}</div>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Dados básicos</h2>
            <p className="text-sm text-gray-500">Editar informações gerais do estabelecimento.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">Nome</span>
              <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">CNPJ</span>
              <input value={form.cnpj} onChange={(e) => setForm((prev) => ({ ...prev, cnpj: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Tipo</span>
              <select value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2">
                {establishmentTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Telefone</span>
              <input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
              <input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">Endereço</span>
              <input value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Cidade</span>
              <input value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Estado</span>
              <input value={form.state} onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">CEP</span>
              <input value={form.zipCode} onChange={(e) => setForm((prev) => ({ ...prev, zipCode: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Caixas</span>
              <input type="number" value={form.cashRegistersCount} onChange={(e) => setForm((prev) => ({ ...prev, cashRegistersCount: Number(e.target.value) }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">Descrição</span>
              <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} className="min-h-[100px] w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))} />
              <span className="text-sm font-medium text-gray-700">Estabelecimento ativo</span>
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              Salvar dados
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Logo e vínculo</h2>
            <p className="text-sm text-gray-500">Trocar a imagem e revisar metadados principais.</p>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-dashed border-gray-300 p-4">
              <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
              <div className="mt-3 text-sm text-gray-500">{logoFile ? logoFile.name : 'Nenhum arquivo selecionado'}</div>
              <button type="button" onClick={handleLogoUpload} disabled={saving || !logoFile} className="mt-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 disabled:opacity-60">
                Enviar logo
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-gray-500">Criado em</p>
                <p className="mt-1 font-medium text-gray-900">{formatDate(establishment.createdAt)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-gray-500">Atualizado em</p>
                <p className="mt-1 font-medium text-gray-900">{formatDate(establishment.updatedAt)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Fidelidade</h2>
            <p className="text-sm text-gray-500">Configurar pontos e ativação.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" checked={Boolean(loyalty.loyaltyEnabled)} onChange={(e) => setLoyalty((prev) => ({ ...prev, loyaltyEnabled: e.target.checked }))} />
              <span className="text-sm font-medium text-gray-700">Ativar fidelidade</span>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Pontos por real</span>
              <input type="number" step="0.01" value={loyalty.loyaltyPointsPerReal ?? 0} onChange={(e) => setLoyalty((prev) => ({ ...prev, loyaltyPointsPerReal: Number(e.target.value) }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
          </div>
          <button type="button" onClick={handleSaveLoyalty} disabled={saving} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
            Salvar fidelidade
          </button>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Fiscal</h2>
            <p className="text-sm text-gray-500">Campos principais para integração fiscal.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Inscrição Estadual</span>
              <input value={fiscal.inscricaoEstadual} onChange={(e) => setFiscal((prev) => ({ ...prev, inscricaoEstadual: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Inscrição Municipal</span>
              <input value={fiscal.inscricaoMunicipal} onChange={(e) => setFiscal((prev) => ({ ...prev, inscricaoMunicipal: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Regime Tributário</span>
              <input value={fiscal.regimeTributario} onChange={(e) => setFiscal((prev) => ({ ...prev, regimeTributario: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">CNAE</span>
              <input value={fiscal.cnae} onChange={(e) => setFiscal((prev) => ({ ...prev, cnae: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">CRT</span>
              <input value={fiscal.crt} onChange={(e) => setFiscal((prev) => ({ ...prev, crt: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Provedor fiscal</span>
              <input value={fiscal.fiscalProvider} onChange={(e) => setFiscal((prev) => ({ ...prev, fiscalProvider: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Ambiente</span>
              <input value={fiscal.fiscalEnvironment} onChange={(e) => setFiscal((prev) => ({ ...prev, fiscalEnvironment: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" checked={fiscal.autoIssueFiscalNote} onChange={(e) => setFiscal((prev) => ({ ...prev, autoIssueFiscalNote: e.target.checked }))} />
              <span className="text-sm font-medium text-gray-700">Emissão automática de nota</span>
            </label>
          </div>
          <button type="button" onClick={handleSaveFiscal} disabled={saving} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
            Salvar fiscal
          </button>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mercado Pago</h2>
            <p className="text-sm text-gray-500">Conexão e credenciais da integração.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Access token</span>
              <input value={mercadoPago.accessToken} onChange={(e) => setMercadoPago((prev) => ({ ...prev, accessToken: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Public key</span>
              <input value={mercadoPago.publicKey} onChange={(e) => setMercadoPago((prev) => ({ ...prev, publicKey: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-2" />
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={handleSaveMercadoPago} disabled={saving} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              Salvar conexão
            </button>
            <button type="button" onClick={() => superAdminEstablishmentsApi.disconnectMercadoPago(establishment.id)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800">
              Desconectar
            </button>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-red-900">Zona de risco</h2>
            <p className="text-sm text-red-700">Excluir o estabelecimento remove os dados de forma definitiva.</p>
          </div>
          <button type="button" onClick={handleDelete} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
            Excluir estabelecimento
          </button>
        </div>
      </section>
    </div>
  );
}
