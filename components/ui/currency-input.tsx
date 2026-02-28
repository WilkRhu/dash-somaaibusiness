'use client';

import { useState, useEffect } from 'react';
import { maskCurrency, parseCurrency } from '@/lib/utils/format';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CurrencyInput({ 
  value, 
  onChange, 
  label, 
  required = false,
  disabled = false,
  className = ''
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    // Inicializa o display com o valor formatado
    // Converte o valor em reais para centavos (multiplica por 100)
    const valueInCents = Math.round(value * 100).toString();
    const formatted = maskCurrency(valueInCents);
    setDisplayValue(formatted);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Aplica a máscara
    const masked = maskCurrency(inputValue);
    setDisplayValue(masked);
    
    // Converte para número e chama onChange
    const numericValue = parseCurrency(inputValue);
    onChange(numericValue);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      <input
        type="text"
        required={required}
        disabled={disabled}
        value={displayValue}
        onChange={handleChange}
        placeholder="R$ 0,00"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}
