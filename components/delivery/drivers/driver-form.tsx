'use client';

import { useState, useEffect } from 'react';
import { Driver, CreateDriverInput, UpdateDriverInput, VehiclePhoto, useDeliveryDrivers } from '@/lib/hooks/use-delivery-drivers';
import Image from 'next/image';
import { showToast } from '@/components/ui/toast';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import apiClient from '@/lib/api/client';

interface DriverFormProps {
  driver?: Driver | null;
  establishmentId?: string;
  onSubmit: (data: CreateDriverInput | UpdateDriverInput & { profilePhoto?: string; vehiclePhotos?: VehiclePhoto[] }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const vehicleTypes = [
  { value: 'motorcycle', label: 'Moto' },
  { value: 'bicycle', label: 'Bicicleta' },
  { value: 'car', label: 'Carro' },
  { value: 'van', label: 'Van' },
  { value: 'truck', label: 'Caminhão' },
];

const photoTypes = [
  { value: 'front', label: 'Frente' },
  { value: 'back', label: 'Trás' },
  { value: 'side', label: 'Lateral' },
];

function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 11);
  
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 7) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  }
}

function formatPlate(value: string): string {
  const upper = value.toUpperCase();
  const cleaned = upper.replace(/[^A-Z0-9-]/g, '');
  const withoutHyphen = cleaned.replace(/-/g, '');
  const limited = withoutHyphen.slice(0, 8);
  
  if (limited.length <= 3) {
    return limited;
  }
  
  const isOldPattern = /^[A-Z]{3}\d{4}$/.test(limited);
  const isMercosulPattern = /^[A-Z]{3}\d[A-Z]\d{2}$/.test(limited);
  
  if (isOldPattern || isMercosulPattern) {
    return `${limited.slice(0, 3)}-${limited.slice(3)}`;
  }
  
  return `${limited.slice(0, 3)}-${limited.slice(3)}`;
}

export function DriverForm({ driver, establishmentId, onSubmit, onCancel, loading }: DriverFormProps) {
  const { currentEstablishment } = useEstablishmentStore();
  const { updateVehiclePhoto } = useDeliveryDrivers();
  const finalEstablishmentId = establishmentId || currentEstablishment?.id;
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'motorcycle' as 'motorcycle' | 'bicycle' | 'car' | 'van' | 'truck',
    vehiclePlate: '',
  });

  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [profilePhotoBase64, setProfilePhotoBase64] = useState<string | null>(null);
  const [vehiclePhotos, setVehiclePhotos] = useState<VehiclePhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!driver) return;

    let phoneToDisplay = driver.phone;
    if (phoneToDisplay.startsWith('+55')) {
      phoneToDisplay = phoneToDisplay.slice(3);
    }

    setFormData({
      name: driver.name,
      phone: formatPhoneNumber(phoneToDisplay),
      email: driver.email || '',
      vehicleType: driver.vehicleType,
      vehiclePlate: driver.vehiclePlate || '',
    });

    if (driver.profilePhoto) {
      setProfilePhotoPreview(driver.profilePhoto);
    }

    // Busca fotos do veículo via GET dedicado
    if (driver.id && finalEstablishmentId) {
      setLoadingPhotos(true);
      apiClient
        .get(`/business/establishments/${finalEstablishmentId}/delivery/drivers/${driver.id}/vehicle-photos`)
        .then((res) => {
          const raw = res.data?.data ?? res.data ?? [];
          const photos: VehiclePhoto[] = Array.isArray(raw)
            ? raw.map((p: any) => ({
                photo: p.photoUrl ?? p.photo,
                photoType: p.photoType,
              })).filter((p: VehiclePhoto) => p.photo)
            : [];
          if (photos.length > 0) {
            setVehiclePhotos(photos);
          } else if (driver.vehiclePhotos && driver.vehiclePhotos.length > 0) {
            setVehiclePhotos(driver.vehiclePhotos);
          }
        })
        .catch(() => {
          // fallback: usar o que veio na listagem
          if (driver.vehiclePhotos && driver.vehiclePhotos.length > 0) {
            setVehiclePhotos(driver.vehiclePhotos);
          }
        })
        .finally(() => setLoadingPhotos(false));
    } else if (driver.vehiclePhotos && driver.vehiclePhotos.length > 0) {
      setVehiclePhotos(driver.vehiclePhotos);
    }
  }, [driver?.id]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPlate(e.target.value);
    setFormData({ ...formData, vehiclePlate: formatted });
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setProfilePhotoBase64(base64);
        setProfilePhotoPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePhoto = () => {
    setProfilePhotoPreview(null);
    setProfilePhotoBase64(null);
  };

  const handleVehiclePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, photoType: 'front' | 'back' | 'side') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        
        // Se estiver editando, faz upload imediato
        if (driver?.id && finalEstablishmentId) {
          setUploadingPhoto(true);
          try {
            const success = await updateVehiclePhoto(finalEstablishmentId, driver.id, photoType, base64);
            if (success) {
              const existingIndex = vehiclePhotos.findIndex(p => p.photoType === photoType);
              if (existingIndex >= 0) {
                const updated = [...vehiclePhotos];
                updated[existingIndex] = { photo: base64, photoType };
                setVehiclePhotos(updated);
              } else {
                setVehiclePhotos([...vehiclePhotos, { photo: base64, photoType }]);
              }
              showToast('Foto do veículo atualizada com sucesso!', 'success');
            } else {
              showToast('Erro ao atualizar foto do veículo', 'error');
            }
          } catch {
            showToast('Erro ao atualizar foto do veículo', 'error');
          } finally {
            setUploadingPhoto(false);
          }
        } else {
          // Se estiver criando, apenas adiciona ao array local
          const existingIndex = vehiclePhotos.findIndex(p => p.photoType === photoType);
          
          if (existingIndex >= 0) {
            const updated = [...vehiclePhotos];
            updated[existingIndex] = { photo: base64, photoType };
            setVehiclePhotos(updated);
          } else {
            setVehiclePhotos([...vehiclePhotos, { photo: base64, photoType }]);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeVehiclePhoto = (photoType: 'front' | 'back' | 'side') => {
    setVehiclePhotos(vehiclePhotos.filter(p => p.photoType !== photoType));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanPhone = formData.phone.replace(/\D/g, '');
    
    if (cleanPhone.length !== 11) {
      showToast('Telefone deve ter 11 dígitos', 'error');
      return;
    }
    
    const submitData: any = {
      ...formData,
      phone: cleanPhone, // Envia apenas os dígitos sem +55
    };

    if (profilePhotoBase64) {
      submitData.profilePhoto = profilePhotoBase64;
    }
    
    // Na criação, envia as fotos do veículo
    // Na edição, as fotos já foram enviadas individualmente
    if (!driver && vehiclePhotos.length > 0) {
      submitData.vehiclePhotos = vehiclePhotos;
    }
    
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Foto de Perfil - Redonda no topo */}
      <div className="flex flex-col items-center">
        <div className="relative">
          {profilePhotoPreview ? (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 bg-gray-100">
              <Image
                src={profilePhotoPreview}
                alt="Foto de perfil"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-center text-sm">Foto de Perfil</span>
            </div>
          )}
          
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              className="hidden"
            />
          </label>

          {profilePhotoPreview && (
            <button
              type="button"
              onClick={removeProfilePhoto}
              className="absolute top-0 left-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Formulário Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="João Silva"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={handlePhoneChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(11) 98765-4321"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="joao@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Veículo *</label>
          <select
            value={formData.vehicleType}
            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {vehicleTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Placa do Veículo</label>
        <input
          type="text"
          value={formData.vehiclePlate}
          onChange={handlePlateChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
          placeholder="ABC-1234 (antigo) ou KGJ-1A66 (Mercosul)"
          maxLength={11}
        />
      </div>

      {/* Fotos do Veículo */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fotos do Veículo (Opcional)</h3>

        {loadingPhotos ? (
          <p className="text-sm text-gray-500">Carregando fotos...</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {photoTypes.map((type) => {
              const existingPhoto = vehiclePhotos.find(p => p.photoType === type.value as any);
              
              return (
                <div key={type.value}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{type.label}</label>
                  <label className="cursor-pointer block">
                    {existingPhoto && existingPhoto.photo ? (
                      <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 hover:border-blue-500 transition-colors">
                        <Image
                          src={existingPhoto.photo}
                          alt={`Foto ${type.label}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeVehiclePhoto(type.value as any);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <div className="text-center">
                          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-gray-400 text-sm">Clique para adicionar</span>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVehiclePhotoChange(e, type.value as any)}
                      className="hidden"
                    />
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </>
          ) : (
            driver ? 'Atualizar' : 'Criar'
          )}
        </button>
      </div>
    </form>
  );
}
