'use client';

import { useState } from 'react';
import { Establishment } from '@/lib/types/establishment';
import { establishmentsApi } from '@/lib/api/establishments';
import { maskCEP, maskCNPJ, maskPhone, unmask } from '@/lib/utils/format';

interface EditEstablishmentFormProps {
  establishment: Establishment;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditEstablishmentForm({ establishment, onSuccess, onCancel }: EditEstablishmentFormProps) {
  const [formData, setFormData] = useState({
    name: establishment.name || '',
    cnpj: establishment.cnpj || '',
    type: establishment.type || '',
    phone: establishment.phone || '',
    email: establishment.email || '',
    address: establishment.address || '',
    city: establishment.city || '',
    state: establishment.state || '',
    zipCode: establishment.zipCode || '',
    description: establishment.description || '',
    cashRegistersCount: establishment.cashRegistersCount || 1,
    latitude: establishment.latitude,
    longitude: establishment.longitude,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(establishment.logo || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleCepBlur = async () => {
    const cep = unmask(formData.zipCode);
    
    if (cep.length !== 8) return;

    setLoadingCep(true);
    setError('');

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        return;
      }

      setFormData({
        ...formData,
        address: data.logradouro || formData.address,
        city: data.localidade || formData.city,
        state: data.uf || formData.state,
      });
    } catch (err) {
      setError('Erro ao buscar CEP');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(e.target.value);
    setFormData({ ...formData, zipCode: masked });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    setLoadingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (error) => {
        setLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Permissão de localização negada. Habilite nas configurações do navegador.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Localização indisponível no momento.');
            break;
          case error.TIMEOUT:
            setError('Tempo esgotado ao buscar localização.');
            break;
          default:
            setError('Erro ao obter localização.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Tipo de arquivo inválido. Apenas JPEG, PNG e WebP são permitidos');
        return;
      }
      
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Arquivo muito grande. Tamanho máximo: 5MB');
        return;
      }

      setLogoFile(file);
      setError('');
      
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Atualizar dados do estabelecimento
      await establishmentsApi.update(establishment.id, formData);
      
      // Upload do logo se houver
      if (logoFile) {
        await establishmentsApi.uploadLogo(establishment.id, logoFile);
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar estabelecimento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo do Estabelecimento
        </label>
        <div className="flex items-start gap-6">
          <div className="relative">
            {logoPreview ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 group">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <div className="bg-white rounded-full p-2">
                      <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 hover:border-brand-blue hover:from-blue-50 hover:to-green-50 transition-all flex flex-col items-center justify-center gap-2 group">
                  <svg className="w-10 h-10 text-gray-400 group-hover:text-brand-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs text-gray-500 group-hover:text-brand-blue transition-colors font-medium">
                    Adicionar
                  </span>
                </div>
              </label>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <label className="relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Escolher Logo</span>
              </label>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Formatos: JPEG, PNG, WebP
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tamanho máximo: 5MB
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Recomendado: 512x512px (1:1)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Estabelecimento *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CNPJ *
          </label>
          <input
            type="text"
            required
            value={formData.cnpj}
            onChange={(e) => setFormData({ ...formData, cnpj: maskCNPJ(e.target.value) })}
            maxLength={18}
            placeholder="00.000.000/0000-00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo *
          </label>
          <select
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          >
            <option value="">Selecione o tipo</option>
            
            {/* Alimentação */}
            <optgroup label="🍽️ Alimentação">
              <option value="Restaurante">Restaurante</option>
              <option value="Lanchonete">Lanchonete</option>
              <option value="Padaria">Padaria</option>
              <option value="Confeitaria">Confeitaria</option>
              <option value="Pizzaria">Pizzaria</option>
              <option value="Churrascaria">Churrascaria</option>
              <option value="Sorveteria">Sorveteria</option>
              <option value="Café">Café</option>
              <option value="Bar">Bar</option>
              <option value="Pub">Pub</option>
              <option value="Boteco">Boteco</option>
              <option value="Pastelaria">Pastelaria</option>
              <option value="Açaí">Açaí</option>
              <option value="Sushi">Sushi</option>
              <option value="Comida Árabe">Comida Árabe</option>
              <option value="Comida Chinesa">Comida Chinesa</option>
              <option value="Comida Mexicana">Comida Mexicana</option>
              <option value="Comida Italiana">Comida Italiana</option>
            </optgroup>

            {/* Varejo */}
            <optgroup label="🛍️ Varejo">
              <option value="Supermercado">Supermercado</option>
              <option value="Mercado">Mercado</option>
              <option value="Loja de Roupas">Loja de Roupas</option>
              <option value="Loja de Eletrônicos">Loja de Eletrônicos</option>
              <option value="Loja de Móveis">Loja de Móveis</option>
              <option value="Loja de Calçados">Loja de Calçados</option>
              <option value="Loja de Cosméticos">Loja de Cosméticos</option>
              <option value="Loja de Brinquedos">Loja de Brinquedos</option>
              <option value="Loja de Livros">Loja de Livros</option>
              <option value="Loja de Esportes">Loja de Esportes</option>
              <option value="Loja de Departamentos">Loja de Departamentos</option>
            </optgroup>

            {/* Saúde e Beleza */}
            <optgroup label="💊 Saúde e Beleza">
              <option value="Farmácia">Farmácia</option>
              <option value="Drogaria">Drogaria</option>
              <option value="Salão de Beleza">Salão de Beleza</option>
              <option value="Barbearia">Barbearia</option>
              <option value="Clínica">Clínica</option>
              <option value="Consultório">Consultório</option>
              <option value="Spa">Spa</option>
              <option value="Academia">Academia</option>
            </optgroup>

            {/* Serviços */}
            <optgroup label="🔧 Serviços">
              <option value="Oficina Mecânica">Oficina Mecânica</option>
              <option value="Lavagem de Carros">Lavagem de Carros</option>
              <option value="Encanador">Encanador</option>
              <option value="Eletricista">Eletricista</option>
              <option value="Marcenaria">Marcenaria</option>
              <option value="Serralheria">Serralheria</option>
              <option value="Vidraçaria">Vidraçaria</option>
              <option value="Pintura">Pintura</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Manutenção">Manutenção</option>
            </optgroup>

            {/* Educação e Cultura */}
            <optgroup label="📚 Educação e Cultura">
              <option value="Escola">Escola</option>
              <option value="Universidade">Universidade</option>
              <option value="Curso">Curso</option>
              <option value="Academia de Dança">Academia de Dança</option>
              <option value="Aula de Música">Aula de Música</option>
              <option value="Biblioteca">Biblioteca</option>
              <option value="Museu">Museu</option>
              <option value="Cinema">Cinema</option>
              <option value="Teatro">Teatro</option>
            </optgroup>

            {/* Hospedagem e Turismo */}
            <optgroup label="🏨 Hospedagem e Turismo">
              <option value="Hotel">Hotel</option>
              <option value="Pousada">Pousada</option>
              <option value="Hostel">Hostel</option>
              <option value="Resort">Resort</option>
              <option value="Agência de Turismo">Agência de Turismo</option>
            </optgroup>

            {/* Transportes */}
            <optgroup label="🚗 Transportes">
              <option value="Táxi">Táxi</option>
              <option value="Uber">Uber</option>
              <option value="Ônibus">Ônibus</option>
              <option value="Locadora de Carros">Locadora de Carros</option>
            </optgroup>

            {/* Outros */}
            <optgroup label="📦 Outros">
              <option value="Loja">Loja</option>
              <option value="Outro">Outro</option>
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
            maxLength={15}
            placeholder="(00) 00000-0000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantidade de Caixas Registradoras
          </label>
          <input
            type="number"
            min="1"
            max="99"
            value={formData.cashRegistersCount}
            onChange={(e) => setFormData({ ...formData, cashRegistersCount: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Número de caixas disponíveis para vendas
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CEP
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.zipCode}
              onChange={handleCepChange}
              onBlur={handleCepBlur}
              maxLength={9}
              placeholder="00000-000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
            {loadingCep && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="animate-spin h-5 w-5 text-brand-blue" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Digite o CEP e os campos serão preenchidos automaticamente
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endereço
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cidade
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            maxLength={2}
            placeholder="Ex: SP"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Localização (GPS)
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={loadingLocation}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50"
            >
              {loadingLocation ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Obtendo...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Obter Localização Atual
                </>
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || undefined })}
                placeholder="-23.550520"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || undefined })}
                placeholder="-46.633308"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              A localização GPS é útil para funcionalidades de delivery e cálculo de distâncias. 
              Clique no botão para capturar automaticamente ou insira manualmente as coordenadas.
            </span>
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
