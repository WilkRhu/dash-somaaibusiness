// Tipos e interfaces para o sistema fiscal

export enum FiscalNoteStatus {
  PROCESSING = 'processing',
  AUTHORIZED = 'authorized',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum FiscalNoteType {
  NFCE = 'nfce',
  NFE = 'nfe',
}

export interface FiscalRecipient {
  cpfCnpj: string;
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface FiscalItem {
  code: string;
  description: string;
  ncm: string;
  cfop: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxes: {
    icms: number;
    pis: number;
    cofins: number;
    ipi?: number;
  };
}

export interface FiscalTotals {
  products: number;
  discount: number;
  freight?: number;
  total: number;
  taxes: {
    icms: number;
    pis: number;
    cofins: number;
    ipi?: number;
  };
}

export interface FiscalNote {
  id: string;
  establishmentId: string;
  saleId?: string;
  type: FiscalNoteType;
  status: FiscalNoteStatus;
  number: string;
  series: string;
  accessKey: string;
  authorizationProtocol?: string;
  authorizedAt?: Date;
  rejectionReason?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  danfeUrl?: string;
  qrCode?: string;
  consultUrl?: string;
  recipient: FiscalRecipient;
  items: FiscalItem[];
  totals: FiscalTotals;
  additionalInfo?: string;
  provider: string;
  environment: 'production' | 'homologation';
  emailSent: boolean;
  smsSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FiscalCertificate {
  id: string;
  establishmentId: string;
  type: 'A1' | 'A3';
  cnpj: string;
  holderName: string;
  expiresAt: Date;
  isActive: boolean;
  daysUntilExpiration: number;
  lastValidatedAt?: Date;
  createdAt: Date;
}

export interface FiscalCorrection {
  id: string;
  fiscalNoteId: string;
  correctionType: number;
  correctionText: string;
  status: 'processing' | 'authorized' | 'rejected';
  protocol?: string;
  rejectionReason?: string;
  createdAt: Date;
}

export interface FiscalDisablement {
  id: string;
  establishmentId: string;
  startNumber: number;
  endNumber: number;
  justification: string;
  status: 'processing' | 'authorized' | 'rejected';
  protocol?: string;
  rejectionReason?: string;
  createdAt: Date;
}

export interface FiscalContingencyNote {
  id: string;
  establishmentId: string;
  documentType: FiscalNoteType;
  series: string;
  number: string;
  status: 'pending' | 'transmitted' | 'failed';
  contingencyReason: string;
  transmissionAttempts: number;
  lastTransmissionAttempt?: Date;
  transmittedAt?: Date;
  failureReason?: string;
  fiscalNoteId?: string;
  createdAt: Date;
}

export interface FiscalMetrics {
  totalNotes: number;
  successRate: number;
  rejectionRate: number;
  averageEmissionTime: number;
  statusBreakdown: {
    authorized: number;
    rejected: number;
    cancelled: number;
    pending: number;
  };
  certificateExpiryDays: number;
  contingencyNotes: number;
}

export interface FiscalNoteFilters {
  page?: number;
  limit?: number;
  status?: FiscalNoteStatus;
  type?: FiscalNoteType;
  startDate?: string;
  endDate?: string;
}

export interface FiscalNoteData {
  type: FiscalNoteType;
  saleId?: string;
  recipient: FiscalRecipient;
  items: FiscalItem[];
  totals: FiscalTotals;
  additionalInfo?: string;
  series: string;
}

export interface CorrectionData {
  correctionType: number;
  correctionText: string;
}

export interface DisablementData {
  startNumber: number;
  endNumber: number;
  justification: string;
}

export interface CnpjLookupResult {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  situacao: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
  };
  telefone?: string;
  email?: string;
  atividadePrincipal: {
    codigo: string;
    descricao: string;
  };
}

export interface CnpjValidationResult {
  valid: boolean;
  formatted?: string;
}
