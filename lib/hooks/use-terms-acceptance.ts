import { useState, useCallback } from 'react';
import {
  recordTermsAcceptance,
  hasAcceptedCurrentTerms,
  getCurrentTermsVersion,
} from '@/lib/api/terms-acceptance';

interface UseTermsAcceptanceReturn {
  isLoading: boolean;
  error: string | null;
  hasAccepted: boolean;
  termsVersion: string;
  acceptTerms: (data: {
    acceptedTermsOfService: boolean;
    acceptedPrivacyPolicy: boolean;
    acceptedPaymentProcessing: boolean;
  }) => Promise<void>;
  checkAcceptance: (userId: string) => Promise<boolean>;
}

/**
 * Hook para gerenciar aceite de termos
 */
export function useTermsAcceptance(): UseTermsAcceptanceReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [termsVersion, setTermsVersion] = useState('1.0.0');

  const acceptTerms = useCallback(
    async (data: {
      acceptedTermsOfService: boolean;
      acceptedPrivacyPolicy: boolean;
      acceptedPaymentProcessing: boolean;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        // Obter versão atual dos termos
        const version = await getCurrentTermsVersion();
        setTermsVersion(version);

        // Obter ID do usuário (deve ser passado do contexto de autenticação)
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('Usuário não identificado');
        }

        // Registrar aceite
        await recordTermsAcceptance({
          userId,
          ...data,
          termsVersion: version,
        });

        setHasAccepted(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao aceitar termos';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const checkAcceptance = useCallback(async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const version = await getCurrentTermsVersion();
      setTermsVersion(version);

      const accepted = await hasAcceptedCurrentTerms(userId, version);
      setHasAccepted(accepted);
      return accepted;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao verificar aceite';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    hasAccepted,
    termsVersion,
    acceptTerms,
    checkAcceptance,
  };
}
