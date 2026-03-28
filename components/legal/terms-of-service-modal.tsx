'use client';

import { useState } from 'react';

interface TermsOfServiceModalProps {
  open: boolean;
  onClose: () => void;
}

export function TermsOfServiceModal({ open, onClose }: TermsOfServiceModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Termos de Uso e Aceite</h2>
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
            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Introdução e Aceitação</h3>
            <p className="text-slate-700 leading-relaxed">
              Bem-vindo ao Sistema de Gestão Fiscal e Pagamentos ("Plataforma"). Estes Termos de Uso e Aceite 
              ("Termos") constituem um contrato vinculativo entre você ("Usuário", "Cliente") e nossa empresa 
              ("Nós", "Empresa", "Plataforma").
            </p>
            <p className="text-slate-700 leading-relaxed mt-4">
              Ao acessar, registrar-se ou usar a Plataforma, você concorda em estar vinculado por estes Termos.
            </p>
          </section>

          {/* Elegibilidade */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Elegibilidade e Registro</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              Para usar a Plataforma, você deve:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Ter pelo menos 18 anos de idade</li>
              <li>Ser residente do Brasil</li>
              <li>Ter capacidade legal para celebrar contratos</li>
              <li>Fornecer informações precisas e completas</li>
              <li>Manter suas informações atualizadas</li>
            </ul>
          </section>

          {/* Responsabilidades */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Responsabilidades do Usuário</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              Você concorda em:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Usar a Plataforma apenas para fins legítimos e legais</li>
              <li>Não violar leis fiscais, trabalhistas ou comerciais</li>
              <li>Não transmitir conteúdo ilegal ou prejudicial</li>
              <li>Não tentar acessar sistemas não autorizados</li>
              <li>Manter registros precisos de transações</li>
              <li>Cumprir com todas as obrigações fiscais e legais</li>
              <li>Não compartilhar sua conta com terceiros</li>
            </ul>
          </section>

          {/* Conformidade Fiscal */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">4. Conformidade Fiscal e Legal</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              Você é responsável por:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Cumprir com todas as obrigações fiscais federais, estaduais e municipais</li>
              <li>Manter registros precisos de vendas e transações</li>
              <li>Emitir documentos fiscais conforme exigido pela lei</li>
              <li>Pagar impostos e contribuições devidos</li>
              <li>Manter certificados digitais (e-CNPJ) válidos e atualizados</li>
              <li>Cumprir com regulamentações de proteção de dados</li>
            </ul>
          </section>

          {/* Planos e Preços */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">5. Planos, Preços e Pagamento</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Pagamentos são processados mensalmente ou conforme o plano escolhido</li>
              <li>Você autoriza débitos automáticos em seu método de pagamento</li>
              <li>Falhas de pagamento podem resultar em suspensão de serviços</li>
              <li>Não há reembolsos por períodos parciais</li>
              <li>Você pode cancelar sua assinatura a qualquer momento</li>
            </ul>
          </section>

          {/* Processamento de Pagamentos */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">6. Processamento de Pagamentos</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              A Plataforma aceita: Cartão de crédito e débito, PIX, Transferência bancária
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Dados de pagamento são processados por provedores certificados (PCI DSS)</li>
              <li>Nunca armazenamos dados completos de cartão</li>
              <li>Você é responsável por proteger suas credenciais</li>
              <li>Notifique-nos imediatamente sobre transações não autorizadas</li>
            </ul>
          </section>

          {/* Limitação de Responsabilidade */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">7. Limitação de Responsabilidade</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              A Plataforma é fornecida "como está" sem garantias de qualquer tipo. Em nenhuma circunstância 
              seremos responsáveis por danos indiretos, incidentais, especiais ou consequentes.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Nossa responsabilidade total não excederá o valor pago por você nos últimos 12 meses.
            </p>
          </section>

          {/* Suspensão e Encerramento */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">8. Suspensão e Encerramento</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              Podemos suspender ou encerrar sua conta se:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Você violar estes Termos</li>
              <li>Houver suspeita de fraude ou atividade ilegal</li>
              <li>Você não pagar as taxas devidas</li>
              <li>Você violar leis aplicáveis</li>
              <li>Houver risco de segurança ou dano</li>
            </ul>
          </section>

          {/* Lei Aplicável */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3">9. Lei Aplicável</h3>
            <p className="text-slate-700 leading-relaxed">
              Estes Termos são regidos pelas leis da República Federativa do Brasil. 
              Qualquer disputa será resolvida nos tribunais competentes do Brasil.
            </p>
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
