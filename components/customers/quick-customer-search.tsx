'use client';

import { useState, useEffect } from 'react';
import { useCustomers } from '@/lib/hooks/use-customers';
import type { Customer } from '@/lib/types/customer';
import { maskCPF, maskPhone, unmask } from '@/lib/utils/format';

interface QuickCustomerSearchProps {
  onCustomerSelect: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
  onCpfChange?: (cpf: string) => void;
}

export function QuickCustomerSearch({ onCustomerSelect, selectedCustomer, onCpfChange }: QuickCustomerSearchProps) {
  const { customers, isLoading } = useCustomers();
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [manualCpf, setManualCpf] = useState('');

  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredCustomers([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerm = unmask(searchValue).toLowerCase();
    
    const filtered = customers.filter((customer) => {
      const customerCpf = unmask(customer.cpf || '').toLowerCase();
      const customerPhone = unmask(customer.phone).toLowerCase();
      const customerName = customer.name.toLowerCase();
      
      return (
        customerCpf.includes(searchTerm) ||
        customerPhone.includes(searchTerm) ||
        customerName.includes(searchTerm)
      );
    });

    setFilteredCustomers(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [searchValue, customers]);

  const handleInputChange = (value: string) => {
    // Aplica máscara automaticamente baseado no que está sendo digitado
    let masked = value;
    const numbers = unmask(value);
    
    // Se tem apenas números, tenta aplicar máscara
    if (numbers.length > 0 && /^\d+$/.test(numbers)) {
      if (numbers.length <= 11) {
        // Pode ser CPF ou telefone
        if (numbers.length === 11) {
          // Se começa com 0, provavelmente é telefone
          if (numbers[0] === '0' || numbers[2] === '9') {
            masked = maskPhone(numbers);
          } else {
            masked = maskCPF(numbers);
          }
        } else if (numbers.length >= 10) {
          masked = maskPhone(numbers);
        } else if (numbers.length >= 3) {
          masked = maskCPF(numbers);
        }
      }
    }
    
    setSearchValue(masked);
  };

  const handleSelectCustomer = (customer: Customer) => {
    onCustomerSelect(customer);
    setSearchValue('');
    setShowSuggestions(false);
  };

  const handleClearCustomer = () => {
    onCustomerSelect(null);
    setSearchValue('');
    setManualCpf('');
    onCpfChange?.('');
  };

  const handleManualCpfChange = (value: string) => {
    const unmasked = unmask(value);
    const masked = maskCPF(unmasked);
    setManualCpf(masked);
    onCpfChange?.(unmasked);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Cliente (Opcional)
      </label>

      {selectedCustomer ? (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
          <div className="flex-1">
            <p className="font-semibold text-brand-navy">{selectedCustomer.name}</p>
            <p className="text-sm text-gray-600">{maskPhone(selectedCustomer.phone)}</p>
            {selectedCustomer.cpf && (
              <p className="text-xs text-gray-500">{maskCPF(selectedCustomer.cpf)}</p>
            )}
            <p className="text-xs text-yellow-700 mt-1 font-medium">
              ⭐ {selectedCustomer.loyaltyPoints} pontos de fidelidade
            </p>
          </div>
          <button
            onClick={handleClearCustomer}
            className="text-gray-400 hover:text-gray-600 p-2"
            title="Remover cliente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => searchValue && setShowSuggestions(true)}
            placeholder="Digite CPF, telefone ou nome..."
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
          
          {isLoading && searchValue && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-blue"></div>
            </div>
          )}

          {showSuggestions && filteredCustomers.length > 0 && (
            <div className="absolute z-50 mt-1 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => handleSelectCustomer(customer)}
                  className="w-full px-4 py-3 hover:bg-blue-50 text-left border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <p className="font-semibold text-brand-navy">{customer.name}</p>
                  <p className="text-sm text-gray-600">{maskPhone(customer.phone)}</p>
                  {customer.cpf && (
                    <p className="text-xs text-gray-500">{maskCPF(customer.cpf)}</p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-yellow-700 font-medium">
                      {customer.loyaltyPoints} pontos
                    </p>
                    <p className="text-xs text-gray-500">
                      {customer.purchaseCount} compras
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showSuggestions && searchValue && filteredCustomers.length === 0 && !isLoading && (
            <div className="absolute z-50 mt-1 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 text-center">
              <p className="text-gray-500 text-sm">Nenhum cliente encontrado</p>
              <p className="text-xs text-gray-400 mt-1">
                O cliente será criado automaticamente após a venda
              </p>
            </div>
          )}
        </div>
      )}

      {selectedCustomer && (
        <div className="mt-2 text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-2">
          💡 Este cliente ganhará pontos de fidelidade nesta compra (1 ponto a cada R$ 10)
        </div>
      )}

      {/* Campo de CPF/CNPJ Manual - Para emissão de nota */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          CPF/CNPJ (para emissão de nota)
        </label>
        <input
          type="text"
          value={manualCpf}
          onChange={(e) => handleManualCpfChange(e.target.value)}
          placeholder="Digite o CPF ou CNPJ..."
          maxLength={18}
          disabled={!!selectedCustomer}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent text-sm disabled:opacity-50 disabled:bg-gray-50"
        />
        <p className="text-xs text-gray-500 mt-1">
          {selectedCustomer 
            ? '✓ CPF será preenchido automaticamente do cliente'
            : 'Preencha para emitir nota sem cliente cadastrado'}
        </p>
      </div>
    </div>
  );
}
