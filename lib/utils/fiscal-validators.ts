// Utilitários de validação para o sistema fiscal

import { unformatCpfCnpj } from './fiscal-formatters';

/**
 * Valida CPF
 * @param cpf - CPF com ou sem formatação
 * @returns true se válido
 */
export function validateCPF(cpf: string): boolean {
  const numbers = unformatCpfCnpj(cpf);

  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(numbers)) return false;

  // Calcula primeiro dígito verificador
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.substring(9, 10))) return false;

  // Calcula segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.substring(10, 11))) return false;

  return true;
}

/**
 * Valida CNPJ
 * @param cnpj - CNPJ com ou sem formatação
 * @returns true se válido
 */
export function validateCNPJ(cnpj: string): boolean {
  const numbers = unformatCpfCnpj(cnpj);

  // Verifica se tem 14 dígitos
  if (numbers.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(numbers)) return false;

  // Calcula primeiro dígito verificador
  let size = numbers.length - 2;
  let numbers_array = numbers.substring(0, size);
  let digit = numbers.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers_array.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digit.charAt(0))) return false;

  // Calcula segundo dígito verificador
  size = numbers.length - 1;
  numbers_array = numbers.substring(0, size);
  digit = numbers.substring(size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers_array.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digit.charAt(0))) return false;

  return true;
}

/**
 * Valida CPF ou CNPJ
 * @param value - CPF ou CNPJ com ou sem formatação
 * @returns true se válido
 */
export function validateCPFCNPJ(value: string): boolean {
  const numbers = unformatCpfCnpj(value);

  if (numbers.length === 11) {
    return validateCPF(numbers);
  } else if (numbers.length === 14) {
    return validateCNPJ(numbers);
  }

  return false;
}

/**
 * Valida email
 * @param email - Email a validar
 * @returns true se válido
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida NCM (8 dígitos)
 * @param ncm - Código NCM
 * @returns true se válido
 */
export function validateNCM(ncm: string): boolean {
  const numbers = ncm.replace(/\D/g, '');
  return numbers.length === 8 && /^\d{8}$/.test(numbers);
}

/**
 * Valida CFOP (4 dígitos)
 * @param cfop - Código CFOP
 * @returns true se válido
 */
export function validateCFOP(cfop: string): boolean {
  const numbers = cfop.replace(/\D/g, '');
  return numbers.length === 4 && /^\d{4}$/.test(numbers);
}

/**
 * Valida CEP
 * @param cep - CEP com ou sem formatação
 * @returns true se válido
 */
export function validateZipCode(cep: string): boolean {
  const numbers = cep.replace(/\D/g, '');
  return numbers.length === 8 && /^\d{8}$/.test(numbers);
}

/**
 * Valida telefone
 * @param phone - Telefone com ou sem formatação
 * @returns true se válido
 */
export function validatePhone(phone: string): boolean {
  const numbers = phone.replace(/\D/g, '');
  return (numbers.length === 10 || numbers.length === 11) && /^\d{10,11}$/.test(numbers);
}

/**
 * Valida chave de acesso (44 dígitos)
 * @param accessKey - Chave de acesso
 * @returns true se válido
 */
export function validateAccessKey(accessKey: string): boolean {
  const numbers = accessKey.replace(/\D/g, '');
  return numbers.length === 44 && /^\d{44}$/.test(numbers);
}

/**
 * Valida código de barras
 * @param barcode - Código de barras
 * @returns true se válido
 */
export function validateBarcode(barcode: string): boolean {
  const numbers = barcode.replace(/\D/g, '');
  return numbers.length > 0 && /^\d+$/.test(numbers);
}

/**
 * Valida valor numérico positivo
 * @param value - Valor a validar
 * @returns true se válido
 */
export function validatePositiveNumber(value: number | string): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
}

/**
 * Valida quantidade
 * @param quantity - Quantidade a validar
 * @returns true se válido
 */
export function validateQuantity(quantity: number | string): boolean {
  const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
  return !isNaN(num) && num > 0;
}

/**
 * Valida texto com comprimento mínimo e máximo
 * @param text - Texto a validar
 * @param minLength - Comprimento mínimo
 * @param maxLength - Comprimento máximo
 * @returns true se válido
 */
export function validateTextLength(text: string, minLength: number = 0, maxLength: number = Infinity): boolean {
  return text.length >= minLength && text.length <= maxLength;
}

/**
 * Valida motivo de cancelamento
 * @param reason - Motivo do cancelamento
 * @returns true se válido
 */
export function validateCancellationReason(reason: string): boolean {
  return validateTextLength(reason, 15, 255);
}

/**
 * Valida texto de correção
 * @param text - Texto da correção
 * @returns true se válido
 */
export function validateCorrectionText(text: string): boolean {
  return validateTextLength(text, 15, 1000);
}

/**
 * Valida justificativa de inutilização
 * @param justification - Justificativa
 * @returns true se válido
 */
export function validateDisablementJustification(justification: string): boolean {
  return validateTextLength(justification, 15, 1000);
}

/**
 * Valida número de série
 * @param series - Número da série
 * @returns true se válido
 */
export function validateSeries(series: string): boolean {
  const numbers = series.replace(/\D/g, '');
  return numbers.length > 0 && numbers.length <= 3;
}

/**
 * Valida intervalo de números para inutilização
 * @param startNumber - Número inicial
 * @param endNumber - Número final
 * @returns true se válido
 */
export function validateNumberRange(startNumber: number, endNumber: number): boolean {
  return (
    startNumber > 0 &&
    endNumber > 0 &&
    startNumber <= endNumber &&
    startNumber <= 999999999 &&
    endNumber <= 999999999
  );
}

/**
 * Valida se pode cancelar nota (verifica prazo)
 * @param authorizedAt - Data de autorização
 * @param noteType - Tipo de nota (nfce ou nfe)
 * @returns true se pode cancelar
 */
export function canCancelNote(authorizedAt: string | Date, noteType: 'nfce' | 'nfe'): boolean {
  const authorized = new Date(authorizedAt);
  const now = new Date();
  const diffMs = now.getTime() - authorized.getTime();

  const timeLimit = noteType === 'nfce' 
    ? 30 * 60 * 1000  // 30 minutos
    : 24 * 60 * 60 * 1000; // 24 horas

  return diffMs <= timeLimit;
}

/**
 * Valida se pode fazer correção (verifica prazo)
 * @param createdAt - Data de criação da nota
 * @returns true se pode fazer correção
 */
export function canMakeCorrection(createdAt: string | Date): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();

  const timeLimit = 30 * 24 * 60 * 60 * 1000; // 30 dias

  return diffMs <= timeLimit;
}

/**
 * Valida arquivo de certificado
 * @param file - Arquivo a validar
 * @returns true se válido
 */
export function validateCertificateFile(file: File): boolean {
  const validExtensions = ['pfx', 'p12'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const extension = file.name.split('.').pop()?.toLowerCase();
  const isValidExtension = !!extension && validExtensions.includes(extension);
  const isValidSize = file.size <= maxSize;

  return isValidExtension && isValidSize;
}

/**
 * Valida senha de certificado
 * @param password - Senha a validar
 * @returns true se válido
 */
export function validateCertificatePassword(password: string): boolean {
  return validateTextLength(password, 4, 50);
}

/**
 * Valida dados de emissão de nota
 * @param data - Dados a validar
 * @returns Objeto com validações
 */
export function validateNoteEmissionData(data: {
  type?: string;
  recipient?: { cpfCnpj?: string; name?: string; email?: string };
  items?: any[];
  additionalInfo?: string;
}): Record<string, boolean> {
  return {
    hasType: !!data.type && ['nfce', 'nfe'].includes(data.type),
    hasRecipientName: !!data.recipient?.name,
    hasValidCpfCnpj: !data.recipient?.cpfCnpj || validateCPFCNPJ(data.recipient.cpfCnpj),
    hasValidEmail: !data.recipient?.email || validateEmail(data.recipient.email),
    hasItems: !!data.items && data.items.length > 0,
    hasValidAdditionalInfo: !data.additionalInfo || validateTextLength(data.additionalInfo, 0, 5000),
  };
}
