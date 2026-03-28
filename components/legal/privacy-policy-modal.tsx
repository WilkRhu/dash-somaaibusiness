'use client';

import { useState } from 'react';

interface PrivacyPolicyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ open, onClose }: PrivacyPolicyModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Política de Privacidade</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Introdução */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Introdução</h3>
            <p className="text-slate-700 leading-relaxed">
              A presente Política de Privacidade ("Política") descreve como o Sistema de Gestão Fiscal e Pagamentos 
              ("Plataforma", "nós", "nosso") coleta, utiliza, processa e protege os dados pessoais dos usuários 
              ("você", "usuário", "cliente").
            </p>
            <p className="text-slate-700 leading-relaxed mt-4">
              Estamos comprometidos em proteger sua privacidade e garantir que você tenha uma experiência positiva 
              em nossa Plataforma. Esta Política se aplica a todos os usuários, incluindo proprietários de 
              estabelecimentos, gerentes, entregadores e clientes finais.
            </p>
          </section>

          {/* Dados Coletados */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Dados que Coletamos</h3>
            
            <h4 className="text-lg font-semibold text-slate-800 mt-4 mb-2">2.1 Dados de Identificação</h4>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Nome completo, Email, Número de telefone</li>
              <li>CPF/CNPJ, Data de nascimento, Endereço completo</li>
            </ul>

            <h4 className="text-lg font-semibold text-slate-800 mt-4 mb-2">2.2 Dados Comerciais e Fiscais</h4>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Informações do estabelecimento, Inscrição estadual e municipal</li>
              <li>Certificados digitais (e-CNPJ), Histórico de vendas</li>
              <li>Notas fiscais eletrônicas, Dados de inventário</li>
            </ul>

            <h4 className="text-lg font-semibold text-slate-800 mt-4 mb-2">2.3 Dados de Pagamento</h4>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Informações de cartão (processadas de forma segura)</li>
              <li>Dados bancários, Histórico de transações</li>
            </ul>

            <h4 className="text-lg font-semibold text-slate-800 mt-4 mb-2">2.4 Dados Técnicos</h4>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Endereço IP, Tipo de navegador e dispositivo</li>
              <li>Cookies, Logs de acesso e atividades</li>
            </ul>
          </section>

          {/* Base Legal */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Base Legal para Processamento</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              Processamos seus dados pessoais com base nas seguintes fundamentações legais:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li><strong>Execução de Contrato:</strong> Para fornecer os serviços contratados</li>
              <li><strong>Obrigação Legal:</strong> Para cumprir com leis fiscais e regulatórias</li>
              <li><strong>Interesse Legítimo:</strong> Para melhorar nossos serviços e segurança</li>
              <li><strong>Consentimento:</strong> Para comunicações de marketing</li>
            </ul>
          </section>

          {/* Segurança */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">4. Segurança dos Dados</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              Implementamos medidas técnicas e organizacionais para proteger seus dados:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Criptografia SSL/TLS para transmissão de dados</li>
              <li>Criptografia de dados em repouso</li>
              <li>Autenticação multifator</li>
              <li>Firewalls e sistemas de detecção de intrusão</li>
              <li>Backups regulares e conformidade com PCI DSS</li>
            </ul>
          </section>

          {/* Direitos do Usuário */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">5. Seus Direitos (LGPD)</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li><strong>Acesso:</strong> Solicitar cópia de seus dados pessoais</li>
              <li><strong>Correção:</strong> Corrigir dados imprecisos</li>
              <li><strong>Exclusão:</strong> Solicitar exclusão de dados</li>
              <li><strong>Portabilidade:</strong> Receber dados em formato estruturado</li>
              <li><strong>Revogação de Consentimento:</strong> Retirar consentimento a qualquer momento</li>
            </ul>
          </section>

          {/* Contato */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">6. Contato</h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-slate-700"><strong>Email:</strong> privacy@sistema.com.br</p>
              <p className="text-slate-700 mt-2"><strong>DPO:</strong> dpo@sistema.com.br</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
