import apiClient from './client';

export interface TermsAcceptanceData {
  userId: string;
  acceptedTermsOfService: boolean;
  acceptedPrivacyPolicy: boolean;
  acceptedPaymentProcessing: boolean;
  acceptanceDate: string;
  ipAddress?: string;
  userAgent?: string;
  termsVersion: string;
}

/**
 * Registra o aceite de termos do usuário
 */
export async function recordTermsAcceptance(
  data: Omit<TermsAcceptanceData, 'acceptanceDate'>
): Promise<TermsAcceptanceData> {
  try {
    const response = await apiClient.post('/api/terms-acceptance', {
      ...data,
      acceptanceDate: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar aceite de termos:', error);
    throw error;
  }
}

/**
 * Obtém o histórico de aceites de termos do usuário
 */
export async function getTermsAcceptanceHistory(
  userId: string
): Promise<TermsAcceptanceData[]> {
  try {
    const response = await apiClient.get(`/api/terms-acceptance/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter histórico de aceites:', error);
    throw error;
  }
}

/**
 * Verifica se o usuário aceitou os termos atuais
 */
export async function hasAcceptedCurrentTerms(
  userId: string,
  termsVersion: string = '1.0.0'
): Promise<boolean> {
  try {
    const response = await apiClient.get(
      `/api/terms-acceptance/${userId}/check?version=${termsVersion}`
    );
    return response.data.accepted;
  } catch (error) {
    console.error('Erro ao verificar aceite de termos:', error);
    return false;
  }
}

/**
 * Obtém a versão atual dos termos
 */
export async function getCurrentTermsVersion(): Promise<string> {
  try {
    const response = await apiClient.get('/api/terms-acceptance/version');
    return response.data.version;
  } catch (error) {
    console.error('Erro ao obter versão dos termos:', error);
    return '1.0.0';
  }
}
