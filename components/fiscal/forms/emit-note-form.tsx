'use client';

import { useState } from 'react';
import { FiscalNoteType, FiscalItem, FiscalNoteData } from '@/lib/types/fiscal';
import {
  validateCPFCNPJ,
  validateEmail,
  validateNCM,
  validateCFOP,
  validateQuantity,
  validatePositiveNumber,
} from '@/lib/utils/fiscal-validators';
import { formatCpfCnpj, formatCurrency } from '@/lib/utils/fiscal-formatters';
import { FiscalItemList } from '@/components/fiscal/fiscal-item-list';
import { showToast } from '@/components/ui/toast';

interface EmitNoteFormProps {
  onSubmit: (data: FiscalNoteData) => Promise<void>;
  isLoading?: boolean;
}

interface FormData {
  type: FiscalNoteType;
  cpfCnpj: string;
  name: string;
  email: string;
  phone: string;
  items: FiscalItem[];
  discount: number;
  additionalInfo: string;
  series: string;
}

export function EmitNoteForm({ onSubmit, isLoading = false }: EmitNoteFormProps) {
  const [formData, setFormData] = useState<FormData>({
    type: FiscalNoteType.NFCE,
    cpfCnpj: '',
    name: '',
    email: '',
    phone: '',
    items: [],
    discount: 0,
    additionalInfo: '',
    series: '1',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showItemForm, setShowItemForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<FiscalItem>>({
    code: '',
    description: '',
    ncm: '',
    cfop: '',
    unit: 'UN',
    quantity: 1,
    unitPrice: 0,
  });

  const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
  const total = Math.max(0, subtotal - formData.discount);

  const handleAddItem = () => {
    // Validar item
    if (!newItem.description) {
      showToast('Descrição do item é obrigatória', 'error');
      return;
    }
    if (!validateNCM(newItem.ncm || '')) {
      showToast('NCM inválido (8 dígitos)', 'error');
      return;
    }
    if (!validateCFOP(newItem.cfop || '')) {
      showToast('CFOP inválido (4 dígitos)', 'error');
      return;
    }
    if (!validateQuantity(newItem.quantity || 0)) {
      showToast('Quantidade deve ser maior que 0', 'error');
      return;
    }
    if (!validatePositiveNumber(newItem.unitPrice || 0)) {
      showToast('Preço unitário deve ser maior que 0', 'error');
      return;
    }

    const itemTotal = (newItem.quantity || 0) * (newItem.unitPrice || 0);

    const item: FiscalItem = {
      code: newItem.code || '',
      description: newItem.description,
      ncm: newItem.ncm || '',
      cfop: newItem.cfop || '',
      unit: newItem.unit || 'UN',
      quantity: newItem.quantity || 1,
      unitPrice: newItem.unitPrice || 0,
      total: itemTotal,
      taxes: {
        icms: 0,
        pis: 0,
        cofins: 0,
      },
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));

    setNewItem({
      code: '',
      description: '',
      ncm: '',
      cfop: '',
      unit: 'UN',
      quantity: 1,
      unitPrice: 0,
    });
    setShowItemForm(false);
    showToast('Item adicionado com sucesso', 'success');
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    showToast('Item removido', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validar tipo
    if (!formData.type) {
      newErrors.type = 'Selecione o tipo de nota';
    }

    // Validar CPF/CNPJ (opcional)
    if (formData.cpfCnpj && !validateCPFCNPJ(formData.cpfCnpj)) {
      newErrors.cpfCnpj = 'CPF/CNPJ inválido';
    }

    // Validar nome (opcional)
    if (formData.name && formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Validar email (opcional)
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar itens
    if (formData.items.length === 0) {
      newErrors.items = 'Adicione pelo menos um item';
    }

    // Validar desconto
    if (formData.discount < 0 || formData.discount > subtotal) {
      newErrors.discount = 'Desconto inválido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Corrija os erros no formulário', 'error');
      return;
    }

    try {
      const noteData: FiscalNoteData = {
        type: formData.type,
        recipient: {
          cpfCnpj: formData.cpfCnpj,
          name: formData.name,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
        },
        items: formData.items,
        totals: {
          products: subtotal,
          discount: formData.discount,
          total,
          taxes: {
            icms: 0,
            pis: 0,
            cofins: 0,
          },
        },
        additionalInfo: formData.additionalInfo || undefined,
        series: formData.series,
      };

      await onSubmit(noteData);
      showToast('Nota fiscal emitida com sucesso!', 'success');
      
      // Limpar formulário
      setFormData({
        type: FiscalNoteType.NFCE,
        cpfCnpj: '',
        name: '',
        email: '',
        phone: '',
        items: [],
        discount: 0,
        additionalInfo: '',
        series: '1',
      });
    } catch (error: any) {
      showToast(error.message || 'Erro ao emitir nota', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Nota */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Tipo de Nota</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" style={{borderColor: formData.type === 'nfce' ? '#3b82f6' : '#e5e7eb', backgroundColor: formData.type === 'nfce' ? '#eff6ff' : 'transparent'}}>
            <input
              type="radio"
              name="type"
              value="nfce"
              checked={formData.type === 'nfce'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as FiscalNoteType })}
              className="w-4 h-4"
            />
            <div>
              <p className="font-semibold text-gray-900">NFC-e</p>
              <p className="text-sm text-gray-600">Nota Fiscal de Consumidor Eletrônica</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" style={{borderColor: formData.type === 'nfe' ? '#3b82f6' : '#e5e7eb', backgroundColor: formData.type === 'nfe' ? '#eff6ff' : 'transparent'}}>
            <input
              type="radio"
              name="type"
              value="nfe"
              checked={formData.type === 'nfe'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as FiscalNoteType })}
              className="w-4 h-4"
            />
            <div>
              <p className="font-semibold text-gray-900">NF-e</p>
              <p className="text-sm text-gray-600">Nota Fiscal Eletrônica</p>
            </div>
          </label>
        </div>
      </div>

      {/* Dados do Destinatário */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Destinatário</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ (opcional)</label>
            <input
              type="text"
              value={formData.cpfCnpj}
              onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
              placeholder="00.000.000/0000-00"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent ${
                errors.cpfCnpj ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.cpfCnpj && <p className="text-sm text-red-600 mt-1">{errors.cpfCnpj}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome (opcional)</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome do cliente"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (opcional)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone (opcional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 98765-4321"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Itens */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Itens da Nota</h2>
        <FiscalItemList
          items={formData.items}
          onAddItem={() => setShowItemForm(true)}
          onRemoveItem={handleRemoveItem}
          editable={true}
        />
        {errors.items && <p className="text-sm text-red-600 mt-2">{errors.items}</p>}

        {/* Formulário de Novo Item */}
        {showItemForm && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="font-semibold text-gray-900 mb-4">Novo Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input
                  type="text"
                  value={newItem.code || ''}
                  onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                  placeholder="Código do produto"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                <input
                  type="text"
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Descrição do produto"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NCM *</label>
                <input
                  type="text"
                  value={newItem.ncm || ''}
                  onChange={(e) => setNewItem({ ...newItem, ncm: e.target.value.replace(/\D/g, '').slice(0, 8) })}
                  placeholder="12345678"
                  maxLength={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CFOP *</label>
                <input
                  type="text"
                  value={newItem.cfop || ''}
                  onChange={(e) => setNewItem({ ...newItem, cfop: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  placeholder="5102"
                  maxLength={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                <select
                  value={newItem.unit || 'UN'}
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  <option value="UN">Unidade</option>
                  <option value="KG">Quilograma</option>
                  <option value="L">Litro</option>
                  <option value="M">Metro</option>
                  <option value="M2">Metro Quadrado</option>
                  <option value="M3">Metro Cúbico</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                <input
                  type="number"
                  value={newItem.quantity || 1}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                  placeholder="1"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço Unitário *</label>
                <input
                  type="number"
                  value={newItem.unitPrice || 0}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-3">
                  Total: <strong>{formatCurrency((newItem.quantity || 0) * (newItem.unitPrice || 0))}</strong>
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowItemForm(false)}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Adicionar Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desconto e Observações */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Desconto e Observações</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (R$)</label>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent ${
                errors.discount ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.discount && <p className="text-sm text-red-600 mt-1">{errors.discount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Série</label>
            <input
              type="text"
              value={formData.series}
              onChange={(e) => setFormData({ ...formData, series: e.target.value })}
              placeholder="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              placeholder="Informações adicionais..."
              rows={3}
              maxLength={5000}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.additionalInfo.length}/5000</p>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-green rounded-lg shadow p-6 text-white">
        <div className="space-y-2">
          <div className="flex justify-between text-lg">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Desconto:</span>
            <span>-{formatCurrency(formData.discount)}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold border-t border-white pt-2">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || formData.items.length === 0}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Emitindo...' : '✓ Emitir Nota Fiscal'}
        </button>
      </div>
    </form>
  );
}
