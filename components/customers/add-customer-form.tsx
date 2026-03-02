'use client';

import { useState } from 'react';
import type { CreateCustomerDto } from '@/lib/types/customer';
import { maskCPF, maskPhone, unmask } from '@/lib/utils/format';
import { CustomerImageUpload } from './customer-image-upload';

interface AddCustomerFormProps {
  onSubmit: (data: CreateCustomerDto) => Promise<void>;
  onCancel: () => void;
}

export function AddCustomerForm({ onSubmit, onCancel }: AddCustomerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cpf: '',
    birthDate: '',
    avatar: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (value: string) => {
    const masked = maskPhone(value);
    setFormData({ ...formData, phone: masked });
  };

  const handleCpfChange = (value: string) => {
    const masked = maskCPF(value);
    setFormData({ ...formData, cpf: masked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Remove máscaras e campos vazios opcionais
      const data: CreateCustomerDto = {
        name: formData.name,
        phone: unmask(formData.phone),
      };

      if (formData.email) data.email = formData.email;
      if (formData.cpf) data.cpf = unmask(formData.cpf);
      if (formData.birthDate) data.birthDate = formData.birthDate;
      if (formData.avatar) data.avatar = formData.avatar;

      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Upload de Imagem */}
      <CustomerImageUpload
        currentImage={formData.avatar}
        onImageChange={(base64) => setFormData((prev) => ({ ...prev, avatar: base64 }))}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          required
          maxLength={255}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefone *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          placeholder="(11) 98765-4321"
          required
          maxLength={15}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          placeholder="cliente@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CPF
        </label>
        <input
          type="text"
          value={formData.cpf}
          onChange={(e) => handleCpfChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          placeholder="000.000.000-00"
          maxLength={14}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data de Nascimento
        </label>
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
        </button>
      </div>
    </form>
  );
}
