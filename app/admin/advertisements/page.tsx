'use client';

import { useEffect, useState } from 'react';
import { Advertisement, advertisementsApi } from '@/lib/api/advertisements';
import { AdvertisementsTable } from '@/components/admin/advertisements/advertisements-table';
import { AdvertisementForm } from '@/components/admin/advertisements/advertisement-form';
import { useToast } from '@/lib/hooks/use-toast';

export default function AdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Carregar publicidades
  const loadAdvertisements = async () => {
    try {
      setIsLoading(true);
      const data = await advertisementsApi.list(100, 0);
      setAdvertisements(data);
    } catch (error) {
      console.error('Erro ao carregar publicidades:', error);
      showToast('Erro ao carregar publicidades', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdvertisements();
  }, []);

  // Criar nova publicidade
  const handleCreate = async (data: any) => {
    try {
      setIsSubmitting(true);
      const newAd = await advertisementsApi.create(data);
      setAdvertisements((prev) => [newAd, ...prev]);
      setIsFormOpen(false);
      showToast('Publicidade criada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao criar publicidade:', error);
      showToast('Erro ao criar publicidade', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Atualizar publicidade
  const handleUpdate = async (data: any) => {
    if (!selectedAd) return;

    try {
      setIsSubmitting(true);
      const updatedAd = await advertisementsApi.update(selectedAd.id, data);
      setAdvertisements((prev) =>
        prev.map((ad) => (ad.id === selectedAd.id ? updatedAd : ad))
      );
      setIsFormOpen(false);
      setSelectedAd(undefined);
      showToast('Publicidade atualizada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao atualizar publicidade:', error);
      showToast('Erro ao atualizar publicidade', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Deletar publicidade
  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await advertisementsApi.delete(id);
      setAdvertisements((prev) => prev.filter((ad) => ad.id !== id));
      showToast('Publicidade deletada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao deletar publicidade:', error);
      showToast('Erro ao deletar publicidade', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir formulário para edição
  const handleEdit = (ad: Advertisement) => {
    setSelectedAd(ad);
    setIsFormOpen(true);
  };

  // Fechar formulário
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedAd(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Publicidades</h1>
          <p className="text-gray-600 mt-1">Gerencie as publicidades da plataforma</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nova Publicidade
          </button>
        )}
      </div>

      {/* Formulário */}
      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {selectedAd ? 'Editar Publicidade' : 'Nova Publicidade'}
          </h2>
          <AdvertisementForm
            advertisement={selectedAd}
            onSubmit={selectedAd ? handleUpdate : handleCreate}
            isLoading={isSubmitting}
            onCancel={handleCloseForm}
          />
        </div>
      )}

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Publicidades ({advertisements.length})
        </h2>
        {isLoading && !isFormOpen ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <AdvertisementsTable
            advertisements={advertisements}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
