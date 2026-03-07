'use client';

import { useState, useEffect } from 'react';
import { establishmentsApi } from '@/lib/api/establishments';
import { LoyaltySettings } from '@/lib/types/establishment';
import { showToast } from '@/components/ui/toast';

interface LoyaltySettingsModalProps {
  establishmentId: string;
  establishmentName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoyaltySettingsModal({ 
  establishmentId, 
  establishmentName,
  onClose,
  onSuccess 
}: LoyaltySettingsModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<LoyaltySettings | null>(null);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(true);
  const [pointsPerReal, setPointsPerReal] = useState('0.1');

  useEffect(() => {
    loadSettings();
  }, [establishmentId]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await establishmentsApi.getLoyaltySettings(establishmentId);
      setSettings(data);
      setLoyaltyEnabled(data.loyaltyEnabled);
      setPointsPerReal(data.loyaltyPointsPerReal.toString());
    } catch (error: any) {
      console.error('Erro ao carregar configurações:', error);
      showToast('Erro ao carregar configurações de fidelidade', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const points = parseFloat(pointsPerReal);
    
    if (isNaN(points) || points < 0 || points > 10) {
      showToast('Pontos por real deve estar entre 0 e 10', 'error');
      return;
    }

    try {
      setSaving(true);
      await establishmentsApi.updateLoyaltySettings(establishmentId, {
        loyaltyEnabled,
        loyaltyPointsPerReal: points,
      });
      
      showToast('Configuração de fidelidade atualizada com sucesso!', 'success');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      showToast(error.response?.data?.message || 'Erro ao atualizar configuração', 'error');
    } finally {
      setSaving(false);
    }
  };

  const calculateExample = () => {
    const points = parseFloat(pointsPerReal);
    if (isNaN(points)) return { amount: 'R$ 10,00', points: '0 pontos' };
    
    const pointsFor10 = Math.floor(10 * points);
    const pointsFor100 = Math.floor(100 * points);
    
    return {
      small: `R$ 10,00 = ${pointsFor10} ${pointsFor10 === 1 ? 'ponto' : 'pontos'}`,
      large: `R$ 100,00 = ${pointsFor100} pontos`
    };
  };

  const examples = calculateExample();

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">Configuração de Fidelidade</h2>
            <p className="text-sm text-gray-600 mt-1">{establishmentName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
            </div>
          ) : (
            <>
              {/* Informação sobre o Sistema */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-5">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-navy mb-2">Como funciona o Programa de Fidelidade?</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>
                        O programa de fidelidade recompensa seus clientes automaticamente a cada compra. 
                        Quando um cliente cadastrado faz uma compra, ele acumula pontos baseado no valor gasto.
                      </p>
                      <div className="bg-white rounded-lg p-3 mt-3 border border-blue-100">
                        <p className="font-medium text-brand-navy mb-2">Benefícios:</p>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Incentiva clientes a voltarem mais vezes</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Aumenta o ticket médio das compras</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Acúmulo automático - sem trabalho extra</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Você controla a taxa de pontos</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status do Programa */}
              <div className="bg-gradient-to-r from-brand-blue/10 to-brand-green/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-brand-navy mb-1">Programa de Fidelidade</h3>
                    <p className="text-sm text-gray-600">
                      {loyaltyEnabled ? 'Ativo - Clientes acumulam pontos' : 'Inativo - Nenhum ponto será acumulado'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loyaltyEnabled}
                      onChange={(e) => setLoyaltyEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-blue"></div>
                  </label>
                </div>
              </div>

              {/* Configuração de Pontos */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pontos por Real Gasto
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={pointsPerReal}
                    onChange={(e) => setPointsPerReal(e.target.value)}
                    disabled={!loyaltyEnabled}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Valor entre 0 e 10. Exemplo: 0.1 = 1 ponto a cada R$ 10 gastos
                  </p>
                </div>

                {/* Exemplos de Cálculo */}
                {loyaltyEnabled && (
                  <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-brand-navy text-sm mb-3">Exemplos de Acúmulo:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-xs text-gray-600 mb-1">Compra pequena</p>
                        <p className="font-semibold text-brand-navy">{examples.small}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-xs text-gray-600 mb-1">Compra média</p>
                        <p className="font-semibold text-brand-navy">{examples.large}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Estratégias Sugeridas */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-brand-navy mb-3">Estratégias Sugeridas:</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setPointsPerReal('0.5')}
                    disabled={!loyaltyEnabled}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-brand-blue hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-brand-navy">Programa Generoso</p>
                        <p className="text-sm text-gray-600">0.5 pontos/real - R$ 100 = 50 pontos</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Recomendado</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setPointsPerReal('0.2')}
                    disabled={!loyaltyEnabled}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-brand-blue hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-brand-navy">Programa Moderado</p>
                        <p className="text-sm text-gray-600">0.2 pontos/real - R$ 100 = 20 pontos</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setPointsPerReal('0.1')}
                    disabled={!loyaltyEnabled}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-brand-blue hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-brand-navy">Programa Padrão</p>
                        <p className="text-sm text-gray-600">0.1 pontos/real - R$ 100 = 10 pontos</p>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Padrão</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Informações Importantes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Importante:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Mudanças afetam apenas vendas futuras</li>
                      <li>Pontos são arredondados para baixo</li>
                      <li>Apenas o OWNER pode alterar estas configurações</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Como usar */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-green-800 mb-2">Como funciona na prática:</p>
                    <ol className="list-decimal list-inside space-y-1.5">
                      <li>Cliente cadastrado faz uma compra no PDV</li>
                      <li>Sistema calcula automaticamente os pontos</li>
                      <li>Pontos são adicionados ao perfil do cliente</li>
                      <li>Cliente pode consultar seus pontos a qualquer momento</li>
                      <li>Você decide como os pontos podem ser usados (descontos, brindes, etc.)</li>
                    </ol>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Configuração'}
          </button>
        </div>
      </div>
    </div>
  );
}
