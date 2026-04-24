import {
  formatCurrency,
  formatCPF,
  formatCNPJ,
  formatDate,
  formatDateTime,
  formatNoteStatus,
  formatNoteType,
  isCertificateExpired,
  isCertificateExpiringSoon,
} from '@/lib/utils/fiscal-formatters';

describe('Fiscal Formatters', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('R$ 1.000,00');
      expect(formatCurrency(1000.5)).toBe('R$ 1.000,50');
      expect(formatCurrency(0)).toBe('R$ 0,00');
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-1000)).toBe('-R$ 1.000,00');
    });
  });

  describe('formatCPF', () => {
    it('should format CPF correctly', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01');
    });

    it('should handle invalid CPF', () => {
      expect(formatCPF('123')).toBe('123');
    });
  });

  describe('formatCNPJ', () => {
    it('should format CNPJ correctly', () => {
      expect(formatCNPJ('12345678901234')).toBe('12.345.678/0001-34');
    });

    it('should handle invalid CNPJ', () => {
      expect(formatCNPJ('123')).toBe('123');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('15/01/2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = formatDateTime(date);
      expect(formatted).toContain('15/01/2024');
      expect(formatted).toContain('10:30');
    });
  });

  describe('formatNoteStatus', () => {
    it('should format note status correctly', () => {
      expect(formatNoteStatus('authorized')).toBe('Autorizada');
      expect(formatNoteStatus('rejected')).toBe('Rejeitada');
      expect(formatNoteStatus('cancelled')).toBe('Cancelada');
      expect(formatNoteStatus('processing')).toBe('Processando');
    });
  });

  describe('formatNoteType', () => {
    it('should format note type correctly', () => {
      expect(formatNoteType('nfce')).toBe('NFC-e');
      expect(formatNoteType('nfe')).toBe('NF-e');
    });
  });

  describe('isCertificateExpired', () => {
    it('should return true for expired certificate', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isCertificateExpired(pastDate)).toBe(true);
    });

    it('should return false for valid certificate', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      expect(isCertificateExpired(futureDate)).toBe(false);
    });
  });

  describe('isCertificateExpiringSoon', () => {
    it('should return true for certificate expiring soon', () => {
      const soonDate = new Date();
      soonDate.setDate(soonDate.getDate() + 10);
      expect(isCertificateExpiringSoon(soonDate)).toBe(true);
    });

    it('should return false for certificate not expiring soon', () => {
      const laterDate = new Date();
      laterDate.setDate(laterDate.getDate() + 40);
      expect(isCertificateExpiringSoon(laterDate)).toBe(false);
    });
  });
});
