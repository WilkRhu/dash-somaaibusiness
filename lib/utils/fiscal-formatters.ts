// Utilitários de formatação para o sistema fiscal

/**
 * Formata CPF ou CNPJ
 * @param value - String com números do CPF/CNPJ
 * @returns String formatada (CPF: 000.000.000-00 ou CNPJ: 00.000.000/0000-00)
 */
export function formatCpfCnpj(value: string): string {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 11) {
    // CPF: 000.000.000-00
    return numbers
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      .slice(0, 14);
  } else {
    // CNPJ: 00.000.000/0000-00
    return numbers
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      .slice(0, 18);
  }
}

/**
 * Remove formatação de CPF/CNPJ
 * @param value - String formatada
 * @returns String com apenas números
 */
export function unformatCpfCnpj(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Formata moeda em Real
 * @param value - Valor numérico
 * @returns String formatada (R$ 1.234,56)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata data e hora
 * @param date - Data em string ou Date
 * @returns String formatada (dd/mm/yyyy HH:mm)
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Formata apenas a data
 * @param date - Data em string ou Date
 * @returns String formatada (dd/mm/yyyy)
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Formata telefone
 * @param value - String com números do telefone
 * @returns String formatada ((11) 98765-4321)
 */
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return value;
}

/**
 * Remove formatação de telefone
 * @param value - String formatada
 * @returns String com apenas números
 */
export function unformatPhone(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Formata CEP
 * @param value - String com números do CEP
 * @returns String formatada (01234-567)
 */
export function formatZipCode(value: string): string {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2').slice(0, 9);
}

/**
 * Remove formatação de CEP
 * @param value - String formatada
 * @returns String com apenas números
 */
export function unformatZipCode(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Formata número de nota fiscal
 * @param number - Número da nota
 * @returns String formatada (000123)
 */
export function formatNoteNumber(number: string | number): string {
  return String(number).padStart(6, '0');
}

/**
 * Formata chave de acesso (44 dígitos)
 * @param accessKey - Chave de acesso
 * @returns String formatada (3526 0212 3456 7800 0190 6500 1000 1230 0012 3456 7890)
 */
export function formatAccessKey(accessKey: string): string {
  const numbers = accessKey.replace(/\D/g, '');
  return numbers
    .replace(/(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})/, 
      '$1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11')
    .slice(0, 54);
}

/**
 * Remove formatação de chave de acesso
 * @param accessKey - String formatada
 * @returns String com apenas números
 */
export function unformatAccessKey(accessKey: string): string {
  return accessKey.replace(/\D/g, '');
}

/**
 * Formata NCM (8 dígitos)
 * @param ncm - Código NCM
 * @returns String formatada (12345678)
 */
export function formatNCM(ncm: string): string {
  return ncm.replace(/\D/g, '').slice(0, 8).padStart(8, '0');
}

/**
 * Formata CFOP (4 dígitos)
 * @param cfop - Código CFOP
 * @returns String formatada (5102)
 */
export function formatCFOP(cfop: string): string {
  return cfop.replace(/\D/g, '').slice(0, 4).padStart(4, '0');
}

/**
 * Formata código de barras
 * @param barcode - Código de barras
 * @returns String formatada
 */
export function formatBarcode(barcode: string): string {
  return barcode.replace(/\D/g, '');
}

/**
 * Calcula dias até expiração
 * @param expiryDate - Data de expiração
 * @returns Número de dias
 */
export function daysUntilExpiry(expiryDate: string | Date): number {
  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Verifica se certificado está expirado
 * @param expiryDate - Data de expiração
 * @returns true se expirado
 */
export function isCertificateExpired(expiryDate: string | Date): boolean {
  return daysUntilExpiry(expiryDate) < 0;
}

/**
 * Verifica se certificado está próximo de expirar
 * @param expiryDate - Data de expiração
 * @param daysThreshold - Número de dias para considerar próximo (padrão: 30)
 * @returns true se próximo de expirar
 */
export function isCertificateExpiringSoon(expiryDate: string | Date, daysThreshold: number = 30): boolean {
  const days = daysUntilExpiry(expiryDate);
  return days >= 0 && days <= daysThreshold;
}

/**
 * Formata status da nota fiscal em português
 * @param status - Status da nota
 * @returns String formatada
 */
export function formatNoteStatus(status: string): string {
  const statusMap: Record<string, string> = {
    processing: 'Processando',
    authorized: 'Autorizada',
    rejected: 'Rejeitada',
    cancelled: 'Cancelada',
  };
  return statusMap[status] || status;
}

/**
 * Formata tipo de nota fiscal em português
 * @param type - Tipo de nota
 * @returns String formatada
 */
export function formatNoteType(type: string): string {
  const typeMap: Record<string, string> = {
    nfce: 'NFC-e',
    nfe: 'NF-e',
  };
  return typeMap[type] || type;
}

/**
 * Formata tipo de certificado
 * @param type - Tipo de certificado
 * @returns String formatada
 */
export function formatCertificateType(type: string): string {
  const typeMap: Record<string, string> = {
    A1: 'Certificado A1 (Arquivo)',
    A3: 'Certificado A3 (Token/Cartão)',
  };
  return typeMap[type] || type;
}
