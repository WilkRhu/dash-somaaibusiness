'use client';

import { useState, useEffect } from 'react';
import { CreateEstablishmentForm } from '@/components/establishments/create-establishment-form';
import { EditEstablishmentForm } from '@/components/establishments/edit-establishment-form';
import { LoyaltySettingsModal } from '@/components/establishments/loyalty-settings-modal';
import { useEstablishments } from '@/lib/hooks/use-establishments';
import { establishmentsApi } from '@/lib/api/establishments';
import { Establishment } from '@/lib/types/establishment';
import { showToast } from '@/components/ui/toast';

const formatRole = (role?: string) => {
  if (!role) return '';
  return role.replace('business_', '').replace('_', ' ');
};

export default function EstablishmentsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLoyaltySettings, setShowLoyaltySettings] = useState(false);
  const { establishments, currentEstablishment, setCurrentEstablishment, refetch } = useEstablishments();

  // Debug: monitorar mudanças no showDeleteConfirm
  useEffect(() => {
    console.log('🔔 showDeleteConfirm mudou para:', showDeleteConfirm);
  }, [showDeleteConfirm]);

  const handleEstablishmentClick = async (establishment: Establishment) => {
    setLoading(true);
    try {
      const details = await establishmentsApi.getById(establishment.id);
      setSelectedEstablishment(details);
      setCurrentEstablishment(establishment);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEstablishment) return;
    
    setLoading(true);
    try {
      console.log('🗑️ Desativando estabelecimento:', selectedEstablishment.id);
      await establishmentsApi.delete(selectedEstablishment.id);
      console.log('✅ Estabelecimento desativado com sucesso');
      setShowDeleteConfirm(false);
      setSelectedEstablishment(null);
      await refetch();
      showToast('Estabelecimento desativado com sucesso!', 'success');
    } catch (error: any) {
      console.error('❌ Erro ao desativar estabelecimento:', error);
      console.error('❌ Error response:', error.response?.data);
      showToast(error.response?.data?.message || 'Erro ao desativar estabelecimento. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = async () => {
    setEditingEstablishment(null);
    await refetch();
    if (selectedEstablishment) {
      const updated = await establishmentsApi.getById(selectedEstablishment.id);
      setSelectedEstablishment(updated);
    }
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCreateForm(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-brand-navy">Novo Estabelecimento</h1>
        </div>
        
        <CreateEstablishmentForm />
      </div>
    );
  }

  if (editingEstablishment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setEditingEstablishment(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-brand-navy">Editar Estabelecimento</h1>
        </div>
        
        <EditEstablishmentForm 
          establishment={editingEstablishment}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingEstablishment(null)}
        />
      </div>
    );
  }

  if (selectedEstablishment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedEstablishment(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-brand-navy">Detalhes do Estabelecimento</h1>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                console.log('🎯 Botão Fidelidade clicado');
                console.log('📍 Estabelecimento selecionado:', selectedEstablishment);
                setShowLoyaltySettings(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center gap-2"
              title="Configure o programa de fidelidade para recompensar seus clientes"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Fidelidade
            </button>
            <button
              onClick={() => setEditingEstablishment(selectedEstablishment)}
              className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Editar
            </button>
            <button
              onClick={() => {
                console.log('🔴 Botão Desativar clicado');
                console.log('📍 Estabelecimento selecionado:', selectedEstablishment);
                setShowDeleteConfirm(true);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Desativar
            </button>
          </div>
        </div>

      {selectedEstablishment && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {selectedEstablishment.logo ? (
                <img 
                  src={selectedEstablishment.logo} 
                  alt={selectedEstablishment.name}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {selectedEstablishment.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-brand-navy mb-2">
                {selectedEstablishment.name}
              </h2>
              <p className="text-gray-600 capitalize mb-2">Tipo: {selectedEstablishment.type}</p>
              {selectedEstablishment.role && (
                <p className="text-sm text-gray-500 capitalize">
                  Seu papel: {formatRole(selectedEstablishment.role)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-brand-navy mb-3">Informações Básicas</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">CNPJ:</span>
                  <p className="font-medium">{selectedEstablishment.cnpj}</p>
                </div>
                {selectedEstablishment.cashRegistersCount && (
                  <div>
                    <span className="text-gray-500">Caixas Registradoras:</span>
                    <p className="font-medium flex items-center gap-1">
                      <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      {selectedEstablishment.cashRegistersCount} {selectedEstablishment.cashRegistersCount === 1 ? 'caixa' : 'caixas'}
                    </p>
                  </div>
                )}
                {selectedEstablishment.phone && (
                  <div>
                    <span className="text-gray-500">Telefone:</span>
                    <p className="font-medium">{selectedEstablishment.phone}</p>
                  </div>
                )}
                {selectedEstablishment.email && (
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{selectedEstablishment.email}</p>
                  </div>
                )}
              </div>
            </div>

            {(selectedEstablishment.address || selectedEstablishment.city || selectedEstablishment.state) && (
              <div>
                <h3 className="font-semibold text-brand-navy mb-3">Endereço</h3>
                <div className="space-y-2 text-sm">
                  {selectedEstablishment.address && (
                    <div>
                      <span className="text-gray-500">Logradouro:</span>
                      <p className="font-medium">{selectedEstablishment.address}</p>
                    </div>
                  )}
                  {selectedEstablishment.city && (
                    <div>
                      <span className="text-gray-500">Cidade:</span>
                      <p className="font-medium">{selectedEstablishment.city}</p>
                    </div>
                  )}
                  {selectedEstablishment.state && (
                    <div>
                      <span className="text-gray-500">Estado:</span>
                      <p className="font-medium">{selectedEstablishment.state}</p>
                    </div>
                  )}
                  {selectedEstablishment.zipCode && (
                    <div>
                      <span className="text-gray-500">CEP:</span>
                      <p className="font-medium">{selectedEstablishment.zipCode}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {selectedEstablishment.description && (
            <div>
              <h3 className="font-semibold text-brand-navy mb-3">Descrição</h3>
              <p className="text-sm text-gray-600">{selectedEstablishment.description}</p>
            </div>
          )}

          {/* Configuração de Fidelidade */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-brand-navy">Programa de Fidelidade</h3>
              <button
                onClick={() => setShowLoyaltySettings(true)}
                className="text-sm text-brand-blue hover:text-brand-green transition-colors font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configurar
              </button>
            </div>
            
            {/* Informação sobre o programa */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-gray-700">
                  <p className="font-medium text-brand-navy mb-1">Recompense seus clientes automaticamente!</p>
                  <p>
                    Cada vez que um cliente cadastrado faz uma compra, ele acumula pontos baseado no valor gasto. 
                    Isso incentiva retorno e aumenta a fidelidade.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-brand-blue/10 to-brand-green/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-brand-navy">
                    {selectedEstablishment.loyaltyEnabled ? 'Ativo' : 'Inativo'}
                  </p>
                  {selectedEstablishment.loyaltyEnabled ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Acumulando pontos
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                      Pausado
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-brand-blue/10 to-brand-green/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Taxa de Pontos</span>
                </div>
                <p className="text-lg font-semibold text-brand-navy">
                  {selectedEstablishment.loyaltyPointsPerReal || 0.1} pontos/real
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  R$ 10,00 = {Math.floor(10 * (selectedEstablishment.loyaltyPointsPerReal || 0.1))} pontos
                </p>
              </div>
            </div>
          </div>

          {selectedEstablishment.isActive !== undefined && (
            <div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                selectedEstablishment.isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {selectedEstablishment.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmação dentro da view de detalhes */}
      {showDeleteConfirm && (
        <>
          {console.log('🎨 Renderizando modal de confirmação (detalhes)')}
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
            onClick={(e) => {
              console.log('🔵 Clique no backdrop do modal');
              if (e.target === e.currentTarget) {
                setShowDeleteConfirm(false);
              }
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Confirmar Desativação</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja desativar o estabelecimento "{selectedEstablishment?.name}"? 
                Esta ação pode ser revertida posteriormente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    console.log('🟢 Botão "Sim, Desativar" clicado');
                    handleDelete();
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50"
                >
                  {loading ? 'Desativando...' : 'Sim, Desativar'}
                </button>
                <button
                  onClick={() => {
                    console.log('🟡 Botão "Cancelar" clicado');
                    setShowDeleteConfirm(false);
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de Configuração de Fidelidade */}
      {showLoyaltySettings && selectedEstablishment && (
        <>
          {console.log('🎨 Renderizando modal de fidelidade')}
          {console.log('📊 showLoyaltySettings:', showLoyaltySettings)}
          {console.log('🏢 selectedEstablishment:', selectedEstablishment)}
          <LoyaltySettingsModal
            establishmentId={selectedEstablishment.id}
            establishmentName={selectedEstablishment.name}
            onClose={() => setShowLoyaltySettings(false)}
            onSuccess={async () => {
              await refetch();
              if (selectedEstablishment) {
                const updated = await establishmentsApi.getById(selectedEstablishment.id);
                setSelectedEstablishment(updated);
              }
            }}
          />
        </>
      )}
    </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-navy">Estabelecimentos</h1>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
        >
          Novo Estabelecimento
        </button>
      </div>
      
      {establishments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Nenhum estabelecimento cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {establishments.map((establishment) => (
            <div 
              key={establishment.id}
              className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all hover:shadow-lg ${
                currentEstablishment?.id === establishment.id ? 'ring-2 ring-brand-blue' : ''
              }`}
              onClick={() => handleEstablishmentClick(establishment)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {establishment.logo ? (
                      <img 
                        src={establishment.logo} 
                        alt={establishment.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {establishment.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-brand-navy mb-1">
                      {establishment.name}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">{establishment.type}</p>
                  </div>
                </div>
                {currentEstablishment?.id === establishment.id && (
                  <span className="px-2 py-1 bg-brand-blue text-white text-xs rounded-full">
                    Ativo
                  </span>
                )}
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p>CNPJ: {establishment.cnpj}</p>
                {establishment.cashRegistersCount && (
                  <p className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {establishment.cashRegistersCount} {establishment.cashRegistersCount === 1 ? 'caixa' : 'caixas'}
                  </p>
                )}
                {establishment.role && (
                  <p className="text-xs text-gray-500 capitalize">
                    Seu papel: {formatRole(establishment.role)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <p className="text-brand-navy">Carregando detalhes...</p>
          </div>
        </div>
      )}

      {showDeleteConfirm && selectedEstablishment && (() => {
        const establishment = selectedEstablishment as Establishment;
        return (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
            onClick={(e) => {
              console.log('🔵 Clique no backdrop do modal');
              if (e.target === e.currentTarget) {
                setShowDeleteConfirm(false);
              }
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Confirmar Desativação</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja desativar o estabelecimento "{establishment.name}"? 
                Esta ação pode ser revertida posteriormente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    console.log('🟢 Botão "Sim, Desativar" clicado');
                    handleDelete();
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50"
                >
                  {loading ? 'Desativando...' : 'Sim, Desativar'}
                </button>
                <button
                  onClick={() => {
                    console.log('🟡 Botão "Cancelar" clicado');
                    setShowDeleteConfirm(false);
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
