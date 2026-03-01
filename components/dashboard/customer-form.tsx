'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Customer, CreateCustomerDto } from '@/lib/types/customer';

const customerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefone deve ter no mínimo 10 caracteres').max(20),
  cpf: z.string().min(11).max(14).optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CreateCustomerDto) => Promise<void>;
  onCancel: () => void;
}

export function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer
      ? {
          name: customer.name,
          email: customer.email || '',
          phone: customer.phone,
          cpf: customer.cpf || '',
          birthDate: customer.birthDate || '',
        }
      : undefined,
  });

  const handleFormSubmit = async (data: CustomerFormData) => {
    const dto: CreateCustomerDto = {
      name: data.name,
      phone: data.phone,
      ...(data.email && { email: data.email }),
      ...(data.cpf && { cpf: data.cpf }),
      ...(data.birthDate && { birthDate: data.birthDate }),
    };
    await onSubmit(dto);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nome *</label>
        <input
          {...register('name')}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Nome completo"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Telefone *</label>
        <input
          {...register('phone')}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="(11) 99999-9999"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="email@exemplo.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">CPF</label>
        <input
          {...register('cpf')}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="000.000.000-00"
        />
        {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
        <input
          {...register('birthDate')}
          type="date"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>}
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : customer ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
}
