'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { maskCNPJ, maskPhone, maskCEP, unmask } from '@/lib/utils/format';
import { validateCNPJ } from '@/lib/utils/validation';
import { ESTABLISHMENT_TYPE_GROUPS } from '@/lib/constants/establishment-types';
import { useUIStore } from '@/lib/stores/ui-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { establishmentsApi } from '@/lib/api/establishments';
import { SubscriptionPlan, PLAN_LIMITS } from '@/lib/types/subscription';
import { canCreateEstablishment } from '@/lib/utils/subscription';
import { LimitReachedModal } from '@/components/subscription/limit-reached-modal';
import { CreateEstablishmentDto } from '@/lib/types/establishment';

interface EstablishmentFormData {
  name: string;
  cnpj: string;
  type: string;
  phone: string;
  email: string;
  address: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  cashRegistersCount?: number;
  logo?: string;
}

export function CreateEstablishmentForm() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const { token, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [establishmentsCount, setEstablishmentsCount] = useState(0);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  const [formData, setFormData] = useState<EstablishmentFormData>({
    name: '',
    cnpj: '',
    type: '',
    phone: '',
    email: '',
    address: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    zipCode: '',
    description: '',
    cashRegistersCount: 1,
    latitude: undefined,
    longitude: undefined,
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      addToast({
        type: 'error',
        message: 'Tipo de arquivo inválido. Apenas JPEG, PNG e WebP são permitidos',
      });
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: 'error',
        message: 'Arquivo muito grande. Tamanho máximo: 5MB',
      });
      return;
    }

    // Converter para base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setLogoBase64(base64String);
      setLogoPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      addToast({
        type: 'error',
        message: 'Geolocalização não é suportada pelo seu navegador',
      });
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoadingLocation(false);
        addToast({
          type: 'success',
          message: 'Localização obtida com sucesso!',
          duration: 3000,
        });
      },
      (error) => {
        setLoadingLocation(false);
        let errorMessage = 'Erro ao obter localização.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada. Habilite nas configurações do navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível no momento.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo esgotado ao buscar localização.';
            break;
        }
        
        addToast({
          type: 'error',
          message: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar limite do plano
    const userPlan = user?.subscriptionPlan || SubscriptionPlan.FREE;
    const limitCheck = canCreateEstablishment(establishmentsCount, userPlan);
    
    if (!limitCheck.allowed) {
      setShowLimitModal(true);
      return;
    }
    
    setLoading(true);

    // Validar CNPJ
    const cnpjClean = unmask(formData.cnpj);
    if (!validateCNPJ(cnpjClean)) {
      addToast({
        type: 'error',
        message: 'CNPJ inválido',
      });
      setLoading(false);
      return;
    }

    try {
      console.log('🔑 Token do store:', token);
      console.log('🔑 Token do localStorage:', localStorage.getItem('token'));

      const payload = {
        name: formData.name,
        cnpj: formData.cnpj, // Envia COM máscara
        type: formData.type,
        phone: formData.phone, // Envia COM máscara
        email: formData.email,
        address: `${formData.address}, ${formData.number}${formData.complement ? ', ' + formData.complement : ''}`,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode, // Envia COM máscara
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        ...(logoBase64 && { logo: logoBase64 }),
      };

      console.log('📦 Payload:', { ...payload, logo: logoBase64 ? '[BASE64_IMAGE]' : undefined });

      // Usa a API do establishments que já tem o token configurado
      const data = await establishmentsApi.create(payload as CreateEstablishmentDto);
      
      console.log('✅ Estabelecimento criado:', data);

      addToast({
        type: 'success',
        message: 'Estabelecimento criado com sucesso!',
      });
      
      router.push('/establishments');
    } catch (error: unknown) {
      console.error('❌ Erro ao criar estabelecimento:', error);
      const responseError = error as { response?: { data?: { message?: string } } } | null;
      const responseMessage = responseError?.response?.data?.message;
      console.error('❌ Error response:', responseError?.response?.data);
      
      addToast({
        type: 'error',
        message: responseMessage || 'Erro ao criar estabelecimento',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Aplica máscaras específicas
    let maskedValue = value;
    if (name === 'cnpj') {
      maskedValue = maskCNPJ(value);
    } else if (name === 'phone') {
      maskedValue = maskPhone(value);
    } else if (name === 'zipCode') {
      maskedValue = maskCEP(value);
      
      // Busca CEP quando completo (8 dígitos)
      const cepClean = unmask(maskedValue);
      if (cepClean.length === 8) {
        fetchAddressByCEP(cepClean);
      }
    }
    
    setFormData({
      ...formData,
      [name]: maskedValue,
    });
  };

  const fetchAddressByCEP = async (cep: string) => {
    setLoadingCEP(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        addToast({
          type: 'error',
          message: 'CEP não encontrado',
        });
        return;
      }
      
      // Preenche os campos automaticamente
      setFormData(prev => ({
        ...prev,
        address: data.logradouro || prev.address,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));

      addToast({
        type: 'success',
        message: 'Endereço encontrado!',
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      addToast({
        type: 'error',
        message: 'Erro ao buscar CEP. Tente novamente.',
      });
    } finally {
      setLoadingCEP(false);
    }
  };

  // Buscar contagem de estabelecimentos ao montar o componente
  useEffect(() => {
    const fetchEstablishmentsCount = async () => {
      try {
        const establishments = await establishmentsApi.list();
        setEstablishmentsCount(establishments.length);
      } catch (error) {
        console.error('Erro ao buscar estabelecimentos:', error);
      }
    };
    fetchEstablishmentsCount();
  }, []);

  const userPlan = user?.subscriptionPlan || SubscriptionPlan.FREE;
  const planLimits = PLAN_LIMITS[userPlan];

  return (
    <>
      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        currentPlan={userPlan}
        limitType="establishments"
        currentLimit={planLimits.establishments || 0}
        onUpgrade={() => router.push('/subscription')}
      />
      
      <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo Upload */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-brand-navy mb-4">Logo do Estabelecimento</h3>
        
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {logoPreview ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={logoPreview}
                  alt="Preview do logo"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1">
            <label className="block">
              <span className="sr-only">Escolher logo</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleLogoChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gradient-to-r file:from-brand-blue file:to-brand-green
                  file:text-white
                  hover:file:opacity-90
                  file:cursor-pointer cursor-pointer"
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">
              Formatos: JPEG, PNG, WebP • Tamanho máximo: 5MB
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Recomendado: 512x512px ou 1024x1024px (proporção 1:1)
            </p>
          </div>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-brand-navy mb-4">Informações Básicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Nome do Estabelecimento *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Ex: Mercado do João"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              CNPJ *
            </label>
            <input
              type="text"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
            {formData.cnpj && !validateCNPJ(unmask(formData.cnpj)) && (
              <p className="text-xs text-red-600 mt-1">CNPJ inválido</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Tipo *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="">Selecione o tipo</option>
              {ESTABLISHMENT_TYPE_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Telefone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="(11) 99999-9999"
              maxLength={15}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="contato@estabelecimento.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Quantidade de Caixas Registradoras
            </label>
            <input
              type="number"
              name="cashRegistersCount"
              value={formData.cashRegistersCount || 1}
              onChange={handleChange}
              min="1"
              max="99"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Número de caixas disponíveis para vendas
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Descrição
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            placeholder="Descreva seu estabelecimento..."
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-brand-navy">
              Localização (GPS) *
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
              <label className="block text-xs text-gray-600 mb-1">Latitude *</label>
              <input
                type="number"
                step="any"
                required
                value={formData.latitude || ''}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || undefined })}
                placeholder="-23.550520"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Longitude *</label>
              <input
                type="number"
                step="any"
                required
                value={formData.longitude || ''}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || undefined })}
                placeholder="-46.633308"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              A localização GPS é obrigatória para funcionalidades de delivery e cálculo de distâncias. 
              Clique no botão para capturar automaticamente ou insira manualmente as coordenadas.
            </span>
          </p>
        </div>
      </div>

      {/* Endereço */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-brand-navy mb-4">Endereço</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              CEP *
            </label>
            <div className="relative">
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="00000-000"
                maxLength={9}
              />
              {loadingCEP && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="animate-spin h-5 w-5 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Digite o CEP para buscar o endereço</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Estado *
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="">Selecione</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Cidade *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="São Paulo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Bairro
            </label>
            <input
              type="text"
              name="neighborhood"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Centro"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Logradouro (Rua/Avenida) *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Rua das Flores"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Número *
            </label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Complemento
            </label>
            <input
              type="text"
              name="complement"
              value={formData.complement}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Sala 10, Bloco A"
            />
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-brand-navy rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Criando...' : 'Criar Estabelecimento'}
        </button>
      </div>
    </form>
    </>
  );
}
