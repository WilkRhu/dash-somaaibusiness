import {
  validateCPF,
  validateCNPJ,
  validateEmail,
  validateNCM,
  validateCFOP,
  validateNumberRange,
  validateDisablementJustification,
} from '@/lib/utils/fiscal-validators';

describe('Fiscal Validators', () => {
  describe('validateCPF', () => {
    it('should validate correct CPF', () => {
      // Valid CPF format
      expect(validateCPF('11144477735')).toBe(true);
    });

    it('should reject invalid CPF format', () => {
      expect(validateCPF('123')).toBe(false);
      expect(validateCPF('12345678901')).toBe(false);
    });

    it('should reject empty CPF', () => {
      expect(validateCPF('')).toBe(false);
    });
  });

  describe('validateCNPJ', () => {
    it('should validate correct CNPJ', () => {
      // Valid CNPJ format
      expect(validateCNPJ('11222333000181')).toBe(true);
    });

    it('should reject invalid CNPJ format', () => {
      expect(validateCNPJ('123')).toBe(false);
      expect(validateCNPJ('12345678901234')).toBe(false);
    });

    it('should reject empty CNPJ', () => {
      expect(validateCNPJ('')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid.email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });

    it('should accept empty email', () => {
      expect(validateEmail('')).toBe(true);
    });
  });

  describe('validateNCM', () => {
    it('should validate correct NCM', () => {
      expect(validateNCM('12345678')).toBe(true);
    });

    it('should reject invalid NCM', () => {
      expect(validateNCM('1234567')).toBe(false);
      expect(validateNCM('123456789')).toBe(false);
    });

    it('should reject empty NCM', () => {
      expect(validateNCM('')).toBe(false);
    });
  });

  describe('validateCFOP', () => {
    it('should validate correct CFOP', () => {
      expect(validateCFOP('5102')).toBe(true);
      expect(validateCFOP('6102')).toBe(true);
    });

    it('should reject invalid CFOP', () => {
      expect(validateCFOP('123')).toBe(false);
      expect(validateCFOP('12345')).toBe(false);
    });

    it('should reject empty CFOP', () => {
      expect(validateCFOP('')).toBe(false);
    });
  });

  describe('validateNumberRange', () => {
    it('should validate correct range', () => {
      expect(validateNumberRange(1, 10)).toBe(true);
      expect(validateNumberRange(1, 1)).toBe(true);
    });

    it('should reject invalid range', () => {
      expect(validateNumberRange(10, 1)).toBe(false);
    });
  });

  describe('validateDisablementJustification', () => {
    it('should validate correct justification', () => {
      expect(validateDisablementJustification('This is a valid justification')).toBe(true);
    });

    it('should reject short justification', () => {
      expect(validateDisablementJustification('short')).toBe(false);
    });

    it('should reject long justification', () => {
      const longText = 'a'.repeat(1001);
      expect(validateDisablementJustification(longText)).toBe(false);
    });

    it('should reject empty justification', () => {
      expect(validateDisablementJustification('')).toBe(false);
    });
  });
});
