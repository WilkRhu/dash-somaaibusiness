'use client';

import { useState, useEffect } from 'react';
import { useDeliveryDrivers, Driver, CreateDriverInput, UpdateDriverInput } from '@/lib/hooks/use-delivery-drivers';
import { DriversList } from '@/components/delivery/drivers/drivers-list';
import { DriverForm } from '@/components/delivery/drivers/driver-form';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { showToast } from '@/components/ui/toast';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';

export default function DeliveryDriversPage() {
  const { currentEstablishment } = useEstablishmentStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  const [filterActive, setFilterActive] = useState<string>('all');

  const {
    drivers,
    loading,
    error,
    fetchDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
    toggleAvailability,
    toggleActive,
  } = useDeliveryDrivers();

  useEffect(() => {
    if (currentEstablishment) {
      const filters = filterActive !== 'all' ? { isActive: filterActive === 'active' } : undefined;
      fetchDrivers(currentEstablishment.id, filters);
    }
  }, [currentEstablishment, filterActive, fetchDrivers]);

  const handleCreateDriver = async (data: CreateDriverInput | UpdateDriverInput) => {
    if (!currentEstablishment) return;

    try {
      if (selectedDriver) {
        const result = await updateDriver(currentEstablishment.id, selectedDriver.id, data as UpdateDriverInput);
        if (result) {
          showToast('Entregador atualizado com sucesso!', 'success');
          setShowForm(false);
          setSelectedDriver(null);
        }
      } else {
        const result = await createDriver(currentEstablishment.id, data as CreateDriverInput);
        if (result) {
          showToast('Entregador criado com sucesso!', 'success');
          setShowForm(false);
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Erro ao salvar entregador', 'error');
    }
  };

  const handleDeleteDriver = async () => {
    if (!currentEstablishment || !driverToDelete) return;

    try {
      const success = await deleteDriver(currentEstablishment.id, driverToDelete.id);
      if (success) {
        showToast('Entregador deletado com sucesso!', 'success');
        setShowDeleteModal(false);
        setDriverToDelete(null);
      }
    } catch (error: any) {
      showToast(error.message || 'Erro ao deletar entregador', 'error');
    }
  };

  const handleToggleAvailability = async (driver: Driver) => {
    if (!currentEstablishment) return;

    try {
      const result = await toggleAvailability(currentEstablishment.id, driver.id, !driver.isAvailable);
      if (result) {
        showToast(
          result.isAvailable ? 'Entregador marcado como disponível' : 'Entregador marcado como ocupado',
          'success'
        );
      }
    } catch (error: any) {
      showToast(error.message || 'Erro ao atualizar disponibilidade', 'error');
    }
  };

  const handleToggleActive = async (driver: Driver) => {
    if (!currentEstablishment) return;

    try {
      const result = await toggleActive(currentEstablishment.id, driver.id, !driver.isActive);
      if (result) {
        showToast(
          result.isActive ? 'Entregador ativado' : 'Entregador desativado',
          'success'
        );
      }
    } catch (error: any) {
      showToast(error.message || 'Erro ao atualizar status', 'error');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Entregadores</h1>
        <p className="text-gray-600 mt-2">Gerencie os entregadores do seu estabelecimento</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {selectedDriver ? 'Editar Entregador' : 'Novo Entregador'}
          </h2>
          <DriverForm
            driver={selectedDriver}
            establishmentId={currentEstablishment?.id}
            onSubmit={handleCreateDriver}
            onCancel={() => {
              setShowForm(false);
              setSelectedDriver(null);
            }}
            loading={loading}
          />
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-4">
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedDriver(null);
                setShowForm(true);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Novo Entregador
            </button>
          </div>

          <DriversList
            drivers={drivers}
            loading={loading}
            onEdit={(driver) => {
              setSelectedDriver(driver);
              setShowForm(true);
            }}
            onDelete={(driver) => {
              setDriverToDelete(driver);
              setShowDeleteModal(true);
            }}
            onToggleAvailability={handleToggleAvailability}
            onToggleActive={handleToggleActive}
          />
        </>
      )}

      {showDeleteModal && driverToDelete && (
        <ConfirmModal
          title="Deletar Entregador"
          message={`Tem certeza que deseja deletar o entregador "${driverToDelete.name}"? Esta ação não pode ser desfeita.`}
          confirmText="Deletar"
          onConfirm={handleDeleteDriver}
          onCancel={() => {
            setShowDeleteModal(false);
            setDriverToDelete(null);
          }}
        />
      )}
    </div>
  );
}
