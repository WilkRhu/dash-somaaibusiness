'use client';

import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { superAdminEstablishmentsApi } from '@/lib/api/super-admin-establishments';

interface Establishment {
  id: string;
  name: string;
  cnpj: string;
  type: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  logo: string;
  description: string;
  cashRegistersCount: number;
  loyaltyEnabled: boolean;
  loyaltyPointsPerReal: number;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const establishmentTypes = [
  { value: '', label: 'Todos os tipos' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'bar', label: 'Bar' },
  { value: 'lanchonete', label: 'Lanchonete' },
  { value: 'padaria', label: 'Padaria' },
  { value: 'mercado', label: 'Mercado' },
  { value: 'farmacia', label: 'Farmácia' },
  { value: 'outro', label: 'Outro' },
];

export default function EstablishmentsPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState('');
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const fetchEstablishments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await superAdminEstablishmentsApi.list();
      setEstablishments(data);
    } catch {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      restaurante: 'Restaurante',
      bar: 'Bar',
      lanchonete: 'Lanchonete',
      padaria: 'Padaria',
      mercado: 'Mercado',
      farmacia: 'Farmácia',
      outro: 'Outro',
    };
    return types[type] || type;
  };

  const filteredEstablishments = establishments.filter((establishment) => {
    const searchTerm = search.trim().toLowerCase();
    const matchesSearch =
      !searchTerm ||
      establishment.name.toLowerCase().includes(searchTerm) ||
      establishment.cnpj.toLowerCase().includes(searchTerm) ||
      establishment.city.toLowerCase().includes(searchTerm) ||
      establishment.state.toLowerCase().includes(searchTerm) ||
      establishment.description.toLowerCase().includes(searchTerm) ||
      establishment.email.toLowerCase().includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && establishment.isActive) ||
      (statusFilter === 'inactive' && !establishment.isActive);

    const matchesType = !typeFilter || establishment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const activeCount = establishments.filter((item) => item.isActive).length;
  const inactiveCount = establishments.length - activeCount;
  const loyaltyCount = establishments.filter((item) => item.loyaltyEnabled).length;
  const citiesCount = new Set(establishments.map((item) => `${item.city}-${item.state}`)).size;

  const summaryCards = [
    { label: 'Total', value: establishments.length, description: 'Estabelecimentos cadastrados' },
    { label: 'Ativos', value: activeCount, description: 'Operando normalmente' },
    { label: 'Inativos', value: inactiveCount, description: 'Requerem atenção' },
    { label: 'Fidelidade', value: loyaltyCount, description: 'Com pontos habilitados' },
    { label: 'Cidades', value: citiesCount, description: 'Cidades atendidas' },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Estabelecimentos</h1>
          <p className="text-gray-500 mt-1">Visão consolidada para super admin.</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Estabelecimentos</h1>
          <p className="text-gray-500 mt-1">Visão consolidada para super admin.</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
              SomaAI Business
            </span>
            <h1 className="mt-3 text-3xl font-bold">Estabelecimentos</h1>
            <p className="mt-2 max-w-2xl text-white/70">
              Painel executivo para monitorar lojas, filtrar problemas e acessar módulos operacionais com rapidez.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchEstablishments}
              className="rounded-lg bg-white px-4 py-2 font-medium text-slate-900 transition-colors hover:bg-white/90"
            >
              Recarregar visão
            </button>
            <Link
              href="/admin"
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 font-medium text-white transition-colors hover:bg-white/10"
            >
              Dashboard admin
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="mt-1 text-sm text-gray-500">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Buscar</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nome, CNPJ, cidade, email ou descrição"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Tipo</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {establishmentTypes.map((type) => (
                <option key={type.value || 'all'} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-[320px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estabelecimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CNPJ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cadastro
                </th>
                <th className="w-[320px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEstablishments.map((establishment) => (
                <Fragment key={establishment.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="w-[320px] px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {establishment.logo ? (
                            <Image
                              src={establishment.logo}
                              alt={establishment.name}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{establishment.name}</div>
                          <div className="text-sm text-gray-500">{establishment.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCNPJ(establishment.cnpj)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getTypeLabel(establishment.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{establishment.phone}</div>
                      <div className="text-sm text-gray-500">{establishment.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{establishment.address}</div>
                      <div className="text-sm text-gray-500">
                        {establishment.city} - {establishment.state}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {establishment.cashRegistersCount} caixas
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            establishment.loyaltyEnabled
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {establishment.loyaltyEnabled
                            ? `Fidelidade ${establishment.loyaltyPointsPerReal}x`
                            : 'Fidelidade off'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          establishment.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {establishment.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(establishment.createdAt)}
                    </td>
                    <td className="w-[320px] px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenActionMenuId((current) => (current === establishment.id ? null : establishment.id))
                        }
                        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
                        aria-expanded={openActionMenuId === establishment.id}
                      >
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                          Ver ações
                        </span>
                        <svg
                          className={`h-4 w-4 text-gray-400 transition-transform ${
                            openActionMenuId === establishment.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  {openActionMenuId === establishment.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={8} className="px-6 pb-6">
                        <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">Ações do estabelecimento</p>
                              <p className="text-xs text-gray-500">Atalhos rápidos para {establishment.name}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setOpenActionMenuId(null)}
                              className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                            >
                              Fechar
                            </button>
                          </div>
                          <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4">
                            <Link
                              href={`/admin/business/establishments/${establishment.id}`}
                              onClick={() => setOpenActionMenuId(null)}
                              className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-left text-sm font-medium text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
                            >
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12h.01M12 12h.01M9 12h.01M12 18a6 6 0 100-12 6 6 0 000 12z" />
                                </svg>
                              </span>
                              <span className="min-w-0">
                                <span className="block">Detalhes</span>
                                <span className="block text-xs font-normal text-gray-500">Visão e edição</span>
                              </span>
                            </Link>
                            <Link
                              href={`/admin/business/establishments/${establishment.id}/reports`}
                              onClick={() => setOpenActionMenuId(null)}
                              className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-left text-sm font-medium text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
                            >
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                              </span>
                              <span className="min-w-0">
                                <span className="block">Resumo</span>
                                <span className="block text-xs font-normal text-gray-500">Relatórios e visão geral</span>
                              </span>
                            </Link>
                            <Link
                              href={`/admin/business/establishments/${establishment.id}/inventory`}
                              onClick={() => setOpenActionMenuId(null)}
                              className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-left text-sm font-medium text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
                            >
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </span>
                              <span className="min-w-0">
                                <span className="block">Estoque</span>
                                <span className="block text-xs font-normal text-gray-500">Produtos e inventário</span>
                              </span>
                            </Link>
                            <Link
                              href={`/admin/business/establishments/${establishment.id}/sales`}
                              onClick={() => setOpenActionMenuId(null)}
                              className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-left text-sm font-medium text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
                            >
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </span>
                              <span className="min-w-0">
                                <span className="block">Vendas</span>
                                <span className="block text-xs font-normal text-gray-500">Movimento comercial</span>
                              </span>
                            </Link>
                            <Link
                              href={`/admin/business/establishments/${establishment.id}/members`}
                              onClick={() => setOpenActionMenuId(null)}
                              className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-left text-sm font-medium text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
                            >
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </span>
                              <span className="min-w-0">
                                <span className="block">Equipe</span>
                                <span className="block text-xs font-normal text-gray-500">Membros e permissões</span>
                              </span>
                            </Link>
                            <Link
                              href={`/admin/business/establishments/${establishment.id}/delivery`}
                              onClick={() => setOpenActionMenuId(null)}
                              className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-left text-sm font-medium text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
                            >
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                </svg>
                              </span>
                              <span className="min-w-0">
                                <span className="block">Delivery</span>
                                <span className="block text-xs font-normal text-gray-500">Pedidos e entregas</span>
                              </span>
                            </Link>
                            <Link
                              href={`/admin/business/establishments/${establishment.id}/suppliers`}
                              onClick={() => setOpenActionMenuId(null)}
                              className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-left text-sm font-medium text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
                            >
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                </svg>
                              </span>
                              <span className="min-w-0">
                                <span className="block">Fornecedores</span>
                                <span className="block text-xs font-normal text-gray-500">Compras e pedidos</span>
                              </span>
                            </Link>
                            <Link
                              href={`/admin/business/establishments/${establishment.id}/expenses`}
                              onClick={() => setOpenActionMenuId(null)}
                              className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-left text-sm font-medium text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
                            >
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-red-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </span>
                              <span className="min-w-0">
                                <span className="block">Despesas</span>
                                <span className="block text-xs font-normal text-gray-500">Custos e pagamentos</span>
                              </span>
                            </Link>
                            <Link
                              href={`/admin/business/establishments/${establishment.id}/offers`}
                              onClick={() => setOpenActionMenuId(null)}
                              className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-left text-sm font-medium text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
                            >
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </span>
                              <span className="min-w-0">
                                <span className="block">Ofertas</span>
                                <span className="block text-xs font-normal text-gray-500">Promoções e campanhas</span>
                              </span>
                            </Link>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEstablishments.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum resultado</h3>
            <p className="mt-1 text-sm text-gray-500">Tente ajustar os filtros ou remover a busca.</p>
          </div>
        )}
      </div>
    </div>
  );
}
