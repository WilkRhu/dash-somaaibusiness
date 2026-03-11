// Hook para gerenciar certificado fiscal

'use client';

import { useState, useCallback, useEffect } from 'react';
import { fiscalApi } from '@/lib/api/fiscal';
import { FiscalCertificate } from '@/lib/types/fiscal';

export function useFiscalCertificate() {
  const [certificate, setCertificate] = useState<FiscalCertificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);

  // Buscar certificado
  const fetchCertificate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.getCertificate();
      setCertificate(result);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao buscar certificado';
      setError(message);
      console.error('Erro ao buscar certificado:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Upload de certificado
  const uploadCertificate = useCallback(
    async (file: File, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Converter arquivo para base64
        const reader = new FileReader();
        
        return new Promise((resolve, reject) => {
          reader.onload = async () => {
            try {
              const base64 = (reader.result as string).split(',')[1];
              const result = await fiscalApi.uploadCertificate({
                certificateBase64: base64,
                password,
              });
              setCertificate(result);
              setError(null);
              resolve(result);
            } catch (err: any) {
              const message = err.response?.data?.message || err.message || 'Erro ao fazer upload do certificado';
              setError(message);
              reject(new Error(message));
            } finally {
              setIsLoading(false);
            }
          };

          reader.onerror = () => {
            const message = 'Erro ao ler arquivo';
            setError(message);
            setIsLoading(false);
            reject(new Error(message));
          };

          reader.readAsDataURL(file);
        });
      } catch (err: any) {
        const message = err.message || 'Erro ao fazer upload do certificado';
        setError(message);
        setIsLoading(false);
        throw new Error(message);
      }
    },
    []
  );

  // Validar certificado
  const validateCertificate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.validateCertificate();
      setValidationResult(result);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao validar certificado';
      setError(message);
      console.error('Erro ao validar certificado:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch
  const refetch = useCallback(() => {
    fetchCertificate();
  }, [fetchCertificate]);

  // Auto-fetch ao montar
  useEffect(() => {
    fetchCertificate();
  }, [fetchCertificate]);

  return {
    certificate,
    isLoading,
    error,
    validationResult,
    fetchCertificate,
    uploadCertificate,
    validateCertificate,
    refetch,
  };
}
