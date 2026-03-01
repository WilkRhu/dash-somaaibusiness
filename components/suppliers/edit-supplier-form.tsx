'use client';

import { useState, useEffect } from 'react';
import { useSuppliers } from '@/lib/hooks/use-suppliers';
import { showToast } from '../ui/toast';
import { fetchAddressByCep, formatCep, formatCpf, formatCnpj, formatPhone } from '@/lib/utils/viacep';
import { SupplierImageUpload } from './supplier-image-upload';
import type { Supplier, UpdateSupplierDto } from '@/lib/types/supplier';

interface EditSupplierFormProps {
  supplier: Supplier;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditSupplierForm({ supplier, onSuccess, onCancel }: EditSupplierFormProps) {
  const { updateSupplier, isLoading } = useSuppliers();
  const [isLegalEntity, setIsLegalEntity] = useState(!!supplier.cnpj); // true = PJ, false = PF
  const [formData, setFormData] = useState<UpdateSupplierDto>({
    name: supplier.name,
    cnpj: supplier.cnpj || '',
    cpf: supplier.cpf || '',
    email: supplier.email,
    phone: supplier.phone,
    zipCode: supplier.zipCode || '',
    street: supplier.street || '',
    number: supplier.number || '',
    complement: supplier.complement || '',
    neighborhood: supplier.neighborhood || '',
    city: supplier.city || '',
    state: supplier.state || '',
    notes: supplier.notes || '',
    rating: supplier.rating,
    isActive: supplier.isActive,
    image: supplier.image || '',
  });
  const [loadingCep, setLoadingCep] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Preparar dados para envio (remover campo não usado)
    const dataToSend = { ...formData };
    if (isLegalEntity) {
      delete dataToSend.cpf;
    } else {
      delete dataToSend.cnpj;
    }

    try {
      await updateSupplier(supplier.id, dataToSend);
      showToast('Fornecedor atualizado com sucesso!', 'success');
      onSuccess?.();
    } catch (error: any) {
      showToast(error.message || 'Erro ao atualizar fornecedor', 'error');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'rating' 
        ? Number(value) 
        : value,
    }));
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = isLegalEntity ? formatCnpj(value) : formatCpf(value);
    setFormData((prev) => ({
      ...prev,
      [isLegalEntity ? 'cnpj' : 'cpf']: formatted,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setFormData((prev) => ({ ...prev, zipCode: formatted }));
  };

  const handleCepBlur = async () => {
    if (!formData.zipCode || formData.zipCode.replace(/\D/g, '').length !== 8) return;

    setLoadingCep(true);
    try {
      const data = await fetchAddressByCep(formData.zipCode);
      if (data) {
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
        }));
        showToast('Endereço encontrado!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Erro ao buscar CEP', 'error');
    } finally {
      setLoadingCep(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Toggle Pessoa Física / Jurídica */}
      <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
        <span className={`text-sm font-medium ${!isLegalEntity ? 'text-brand-blue' : 'text-gray-500'}`}>
          Pessoa Física
        </span>
        <button
          type="button"
          onClick={() => setIsLegalEntity(!isLegalEntity)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isLegalEntity ? 'bg-brand-blue' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isLegalEntity ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${isLegalEntity ? 'text-brand-blue' : 'text-gray-500'}`}>
          Pessoa Jurídica
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isLegalEntity ? 'Nome da Empresa' : 'Nome Completo'} *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isLegalEntity ? 'CNPJ' : 'CPF'} *
          </label>
          <input
            type="text"
            value={isLegalEntity ? formData.cnpj : formData.cpf}
            onChange={handleDocumentChange}
            required
            maxLength={isLegalEntity ? 18 : 14}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone *
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={handlePhoneChange}
            required
            maxLength={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CEP
        </label>
        <div className="relative">
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleCepChange}
            onBlur={handleCepBlur}
            maxLength={9}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            placeholder="00000-000"
          />
          {loadingCep && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-blue"></div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Preencha o CEP para buscar automaticamente
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rua/Avenida
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número
          </label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Complemento
          </label>
          <input
            type="text"
            name="complement"
            value={formData.complement}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bairro
          </label>
          <input
            type="text"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cidade
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            maxLength={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent uppercase"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Avaliação
        </label>
        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        >
          <option value={5}>★★★★★ Excelente</option>
          <option value={4}>★★★★☆ Muito Bom</option>
          <option value={3}>★★★☆☆ Bom</option>
          <option value={2}>★★☆☆☆ Regular</option>
          <option value={1}>★☆☆☆☆ Ruim</option>
        </select>
      </div>

      {/* Upload de Imagem */}
      <SupplierImageUpload
        currentImage={formData.image}
        onImageChange={(base64) => setFormData((prev) => ({ ...prev, image: base64 }))}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
        />
        <label className="text-sm font-medium text-gray-700">
          Fornecedor ativo
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
