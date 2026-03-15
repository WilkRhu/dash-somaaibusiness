/**
 * API Configuration
 * Determina a URL base para as chamadas de API do frontend
 */

export const getApiBaseUrl = (): string => {
  // Usar a URL do microserviço diretamente
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3009';
};

export const API_BASE_URL = getApiBaseUrl();
