'use client';

import { useState, useEffect } from 'react';
import { useCustomers } from '@/lib/hooks/use-customers';
import type { Customer } from '@/lib/types/customer';
import { formatPhone } from '@/lib/utils/format';

interface CustomerSelectorProps {
  selectedCustomer: Customer | null;
  onSelect: (customer: Customer | null) => void;
  onCreateNew?: () => void;
}

export function CustomerSelector({
  selectedCustomer,
  onSelect,
  onCreateNew,
}: CustomerSelectorProps) {
  const { customers, searchTerm, setSearchTerm, isLoading } = useCustomers();
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.phone.includes(term) ||
          c.email?.toLowerCase().includes(term) ||
          c.cpf?.includes(term)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customers, searchTerm]);

  const handleSelect = (customer: Customer) => {
    onSelect(customer);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onSelect(null);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cliente (Opcional)
      </label>

      {selectedCustomer ? (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex-1">
            <p className="font-medium text-brand-navy">{selectedCustomer.name}</p>
            <p className="text-sm text-gray-600">{formatPhone(selectedCustomer.phone)}</p>
            <p className="text-xs text-yellow-700 mt-1">
              {selectedCustomer.loyaltyPoints} pontos de fidelidade
            </p>
          </div>
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left hover:bg-gray-50 flex justify-between items-center"
          >
            <span className="text-gray-500">Selecionar cliente...</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto max-h-60">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Carregando...
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-gray-500 mb-3">Nenhum cliente encontrado</p>
                    {onCreateNew && (
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onCreateNew();
                        }}
                        className="text-brand-blue hover:underline text-sm font-medium"
                      >
                        Cadastrar novo cliente
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    {filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        onClick={() => handleSelect(customer)}
                        className="w-full px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-b-0"
                      >
                        <p className="font-medium text-brand-navy">{customer.name}</p>
                        <p className="text-sm text-gray-600">{formatPhone(customer.phone)}</p>
                        <p className="text-xs text-yellow-700 mt-1">
                          {customer.loyaltyPoints} pontos
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {onCreateNew && filteredCustomers.length > 0 && (
                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onCreateNew();
                    }}
                    className="w-full px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                  >
                    + Cadastrar Novo Cliente
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
