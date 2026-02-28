'use client';

import { useState, useEffect } from 'react';
import { CreateEstablishmentForm } from '@/components/establishments/create-establishment-form';
import { EditEstablishmentForm } from '@/components/establishments/edit-establishment-form';
import { useEstablishments } from '@/lib/hooks/use-establishments';
import { establishmentsApi } from '@/lib/api/establishments';
import { Establishment } from '@/lib/types/establishment';

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
  const { establishments, currentEstablishment, setCurrentEstablishment, refetch } = useEstablishments();

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
      await establishmentsApi.delete(selectedEstablishment.id);
      setShowDeleteConfirm(false);
      setSelectedEstablishment(null);
      await refetch();
    } catch (error) {
      console.error('Erro ao desativar estabelecimento:', error);
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
              onClick={() => setEditingEstablishment(selectedEstablishment)}
              className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Editar
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Desativar
            </button>
          </div>
        </div>

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

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-brand-navy mb-4">Confirmar Desativação</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja desativar o estabelecimento "{selectedEstablishment?.name}"? 
              Esta ação pode ser revertida posteriormente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50"
              >
                {loading ? 'Desativando...' : 'Sim, Desativar'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
