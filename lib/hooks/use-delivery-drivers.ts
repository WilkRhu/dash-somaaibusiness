import { useState, useCallback } from 'react';
import apiClient from '@/lib/api/client';

export interface VehiclePhoto {
  photo: string;
  photoType: 'front' | 'back' | 'side';
}

export interface Driver {
  id: string;
  establishmentId: string;
  name: string;
  phone: string;
  email?: string;
  vehicleType: 'motorcycle' | 'bicycle' | 'car' | 'van' | 'truck';
  vehiclePlate?: string;
  profilePhoto?: string;
  vehiclePhotos?: VehiclePhoto[];
  isActive: boolean;
  isAvailable: boolean;
  totalDeliveries: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDriverInput {
  name: string;
  phone: string;
  email?: string;
  vehicleType: 'motorcycle' | 'bicycle' | 'car' | 'van' | 'truck';
  vehiclePlate?: string;
  profilePhoto?: string;
  vehiclePhotos?: VehiclePhoto[];
  userId?: string;
}

export interface UpdateDriverInput {
  name?: string;
  phone?: string;
  email?: string;
  vehicleType?: 'motorcycle' | 'bicycle' | 'car' | 'van' | 'truck';
  vehiclePlate?: string;
  profilePhoto?: string;
  vehiclePhotos?: VehiclePhoto[];
  isActive?: boolean;
  isAvailable?: boolean;
}

interface UseDeliveryDriversReturn {
  drivers: Driver[];
  availableDrivers: Driver[];
  loading: boolean;
  error: string | null;
  fetchDrivers: (establishmentId: string, filters?: any) => Promise<void>;
  fetchAvailableDrivers: (establishmentId: string) => Promise<void>;
  fetchDriver: (establishmentId: string, driverId: string) => Promise<Driver | null>;
  createDriver: (establishmentId: string, data: CreateDriverInput) => Promise<Driver | null>;
  updateDriver: (establishmentId: string, driverId: string, data: UpdateDriverInput) => Promise<Driver | null>;
  deleteDriver: (establishmentId: string, driverId: string) => Promise<boolean>;
  toggleAvailability: (establishmentId: string, driverId: string, isAvailable: boolean) => Promise<Driver | null>;
  toggleActive: (establishmentId: string, driverId: string, isActive: boolean) => Promise<Driver | null>;
  updateVehiclePhoto: (establishmentId: string, driverId: string, photoType: 'front' | 'back' | 'side', photoBase64: string) => Promise<boolean>;
}

export function useDeliveryDrivers(): UseDeliveryDriversReturn {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(
    async (establishmentId: string, filters?: any) => {
      try {
        setLoading(true);
        setError(null);
        const queryParams = new URLSearchParams();
        if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive);
        if (filters?.isAvailable !== undefined) queryParams.append('isAvailable', filters.isAvailable);
        if (filters?.page) queryParams.append('page', filters.page);
        if (filters?.limit) queryParams.append('limit', filters.limit);

        const response = await apiClient.get(
          `/business/establishments/${establishmentId}/delivery/drivers?${queryParams.toString()}`
        );
        setDrivers(response.data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchAvailableDrivers = useCallback(
    async (establishmentId: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(
          `/business/establishments/${establishmentId}/delivery/drivers/available/list`
        );
        setAvailableDrivers(response.data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchDriver = useCallback(
    async (establishmentId: string, driverId: string): Promise<Driver | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(
          `/business/establishments/${establishmentId}/delivery/drivers/${driverId}`
        );
        return response.data.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createDriver = useCallback(
    async (establishmentId: string, data: CreateDriverInput): Promise<Driver | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.post(
          `/business/establishments/${establishmentId}/delivery/drivers`,
          data
        );
        setDrivers([...drivers, response.data.data]);
        return response.data.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [drivers]
  );

  const updateDriver = useCallback(
    async (establishmentId: string, driverId: string, data: UpdateDriverInput): Promise<Driver | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.put(
          `/business/establishments/${establishmentId}/delivery/drivers/${driverId}`,
          data
        );
        setDrivers(drivers.map(d => d.id === driverId ? response.data.data : d));
        return response.data.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [drivers]
  );

  const deleteDriver = useCallback(
    async (establishmentId: string, driverId: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        await apiClient.delete(
          `/business/establishments/${establishmentId}/delivery/drivers/${driverId}`
        );
        setDrivers(drivers.filter(d => d.id !== driverId));
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [drivers]
  );

  const toggleAvailability = useCallback(
    async (establishmentId: string, driverId: string, isAvailable: boolean): Promise<Driver | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.patch(
          `/business/establishments/${establishmentId}/delivery/drivers/${driverId}/availability`,
          { isAvailable }
        );
        setDrivers(drivers.map(d => d.id === driverId ? { ...d, isAvailable } : d));
        return response.data.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [drivers]
  );

  const toggleActive = useCallback(
    async (establishmentId: string, driverId: string, isActive: boolean): Promise<Driver | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.patch(
          `/business/establishments/${establishmentId}/delivery/drivers/${driverId}/status`,
          { isActive }
        );
        setDrivers(drivers.map(d => d.id === driverId ? { ...d, isActive } : d));
        return response.data.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [drivers]
  );

  const updateVehiclePhoto = useCallback(
    async (
      establishmentId: string,
      driverId: string,
      photoType: 'front' | 'back' | 'side',
      photoBase64: string
    ): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        // Tenta PATCH primeiro; se não existir (404), faz POST para criar
        try {
          await apiClient.patch(
            `/business/establishments/${establishmentId}/delivery/drivers/${driverId}/vehicle-photos/${photoType}`,
            { photo: photoBase64, photoType }
          );
        } catch (patchErr: any) {
          if (patchErr?.response?.status === 404) {
            await apiClient.post(
              `/business/establishments/${establishmentId}/delivery/drivers/${driverId}/vehicle-photos`,
              { photo: photoBase64, photoType }
            );
          } else {
            throw patchErr;
          }
        }
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    drivers,
    availableDrivers,
    loading,
    error,
    fetchDrivers,
    fetchAvailableDrivers,
    fetchDriver,
    createDriver,
    updateDriver,
    deleteDriver,
    toggleAvailability,
    toggleActive,
    updateVehiclePhoto,
  };
}
