import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso e Aceite',
  description: 'Termos de Uso e Aceite do Sistema de Gestão Fiscal e Pagamentos',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Termos de Uso e Aceite</h1>
        <p className="text-slate-600 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <div className="prose prose-slate max-w-none space-y-8">
          {/* Introdução */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Introdução e Aceitação</h2>
            <p className="text-slate-700 leading-relaxed">
              Bem-vindo ao Sistema de Gestão Fiscal e Pagamentos ("Plataforma"). Estes Termos de Uso e Aceite 
              ("Termos") constituem um contrato vinculativo entre você ("Usuário", "Cliente") e nossa empresa 
              ("Nós", "Empresa", "Plataforma").
            </p>
            <p className="text-slate-700 leading-relaxed mt-4">
              Ao acessar, registrar-se ou usar a Plataforma, você concorda em estar vinculado por estes Termos. 
              Se você não concorda com qualquer parte destes Termos, não use a Plataforma.
            </p>
            <p className="text-slate-700 leading-relaxed mt-4">
              Recomendamos que você leia atentamente estes Termos, bem como nossa Política de Privacidade, 
              antes de usar a Plataforma.
            </p>
          </section>

          {/* Definições */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Definições</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
              <li><strong>Plataforma:</strong> Sistema de Gestão Fiscal e Pagamentos, incluindo website e aplicativos</li>
              <li><strong>Usuário:</strong> Qualquer pessoa que acessa ou usa a Plataforma</li>
              <li><strong>Proprietário:</strong> Usuário que gerencia um estabelecimento comercial</li>
              <li><strong>Gerente:</strong> Usuário com permissões administrativas delegadas</li>
              <li><strong>Entregador:</strong> Usuário responsável por entregas</li>
              <li><strong>Cliente Final:</strong> Comprador de produtos/serviços</li>
              <li><strong>Conteúdo:</strong> Textos, imagens, dados, documentos e outros materiais</li>
              <li><strong>Serviços:</strong> Funcionalidades oferecidas pela Plataforma</li>
            </ul>
          </section>

          {/* Elegibilidade */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Elegibilidade e Registro</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3.1 Requisitos</h3>
            <p className="text-slate-700 leading-relaxed">
              Para usar a Plataforma, você deve:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Ter pelo menos 18 anos de idade</li>
              <li>Ser residente do Brasil</li>
              <li>Ter capacidade legal para celebrar contratos</li>
              <li>Fornecer informações precisas e completas</li>
              <li>Manter suas informações atualizadas</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3.2 Conta de Usuário</h3>
            <p className="text-slate-700 leading-relaxed">
              Você é responsável por:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Manter a confidencialidade de sua senha</li>
              <li>Todas as atividades em sua conta</li>
              <li>Notificar-nos imediatamente sobre acesso não autorizado</li>
              <li>Usar a Plataforma apenas para fins legítimos</li>
            </ul>
          </section>

          {/* Descrição dos Serviços */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Descrição dos Serviços</h2>
            <p className="text-slate-700 leading-relaxed">
              A Plataforma oferece:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Gestão de notas fiscais eletrônicas (NF-e, NFC-e)</li>
              <li>Processamento de pagamentos (cartão, PIX, transferência)</li>
              <li>Gerenciamento de inventário e produtos</li>
              <li>Controle de vendas e relatórios</li>
              <li>Gestão de entregas e logística</li>
              <li>Integração com sistemas fiscais (SEFAZ)</li>
              <li>Suporte ao cliente e documentação</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              Os Serviços são fornecidos "como estão" e podem estar sujeitos a limitações técnicas, 
              manutenção ou interrupções.
            </p>
          </section>

          {/* Planos e Preços */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Planos, Preços e Pagamento</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5.1 Planos de Assinatura</h3>
            <p className="text-slate-700 leading-relaxed">
              A Plataforma oferece diferentes planos com funcionalidades e preços variados. 
              Os preços estão sujeitos a alterações com aviso prévio de 30 dias.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5.2 Pagamento</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Pagamentos são processados mensalmente ou conforme o plano escolhido</li>
              <li>Você autoriza débitos automáticos em seu método de pagamento</li>
              <li>Falhas de pagamento podem resultar em suspensão de serviços</li>
              <li>Não há reembolsos por períodos parciais</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5.3 Cancelamento</h3>
            <p className="text-slate-700 leading-relaxed">
              Você pode cancelar sua assinatura a qualquer momento. O cancelamento entra em vigor 
              no final do período de faturamento atual. Dados podem ser retidos conforme exigências legais.
            </p>
          </section>

          {/* Responsabilidades do Usuário */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Responsabilidades do Usuário</h2>
            <p className="text-slate-700 leading-relaxed">
              Você concorda em:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Usar a Plataforma apenas para fins legítimos e legais</li>
              <li>Não violar leis fiscais, trabalhistas ou comerciais</li>
              <li>Não transmitir conteúdo ilegal, ofensivo ou prejudicial</li>
              <li>Não tentar acessar sistemas não autorizados</li>
              <li>Não interferir com o funcionamento da Plataforma</li>
              <li>Não usar a Plataforma para fraude ou enganação</li>
              <li>Manter registros precisos de transações</li>
              <li>Cumprir com todas as obrigações fiscais e legais</li>
              <li>Não compartilhar sua conta com terceiros</li>
              <li>Notificar-nos sobre violações de segurança</li>
            </ul>
          </section>

          {/* Conformidade Fiscal */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Conformidade Fiscal e Legal</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">7.1 Responsabilidade Fiscal</h3>
            <p className="text-slate-700 leading-relaxed">
              Você é responsável por:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Cumprir com todas as obrigações fiscais federais, estaduais e municipais</li>
              <li>Manter registros precisos de vendas e transações</li>
              <li>Emitir documentos fiscais conforme exigido pela lei</li>
              <li>Pagar impostos e contribuições devidos</li>
              <li>Manter certificados digitais (e-CNPJ) válidos e atualizados</li>
              <li>Cumprir com regulamentações de proteção de dados</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">7.2 Documentos Fiscais</h3>
            <p className="text-slate-700 leading-relaxed">
              A Plataforma facilita a emissão de documentos fiscais, mas você é responsável por:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Garantir a precisão das informações</li>
              <li>Cumprir com prazos de emissão</li>
              <li>Manter cópias e registros</li>
              <li>Resolver problemas com autoridades fiscais</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">7.3 Contingência</h3>
            <p className="text-slate-700 leading-relaxed">
              Em caso de indisponibilidade da Plataforma, você deve seguir os procedimentos de contingência 
              estabelecidos pela legislação fiscal (SEFAZ).
            </p>
          </section>

          {/* Processamento de Pagamentos */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Processamento de Pagamentos</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">8.1 Métodos de Pagamento</h3>
            <p className="text-slate-700 leading-relaxed">
              A Plataforma aceita:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Cartão de crédito e débito</li>
              <li>PIX</li>
              <li>Transferência bancária</li>
              <li>Outros métodos conforme disponível</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">8.2 Segurança</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Dados de pagamento são processados por provedores certificados (PCI DSS)</li>
              <li>Nunca armazenamos dados completos de cartão</li>
              <li>Você é responsável por proteger suas credenciais</li>
              <li>Notifique-nos imediatamente sobre transações não autorizadas</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">8.3 Disputas e Reembolsos</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Reembolsos são processados conforme política específica</li>
              <li>Disputas devem ser reportadas em até 30 dias</li>
              <li>Investigaremos transações questionadas</li>
              <li>Decisões finais são baseadas em evidências</li>
            </ul>
          </section>

          {/* Propriedade Intelectual */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. Propriedade Intelectual</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">9.1 Direitos da Plataforma</h3>
            <p className="text-slate-700 leading-relaxed">
              Todos os direitos autorais, marcas registradas, patentes e outros direitos de propriedade 
              intelectual da Plataforma são de nossa propriedade exclusiva.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">9.2 Licença de Uso</h3>
            <p className="text-slate-700 leading-relaxed">
              Concedemos a você uma licença limitada, não exclusiva e revogável para usar a Plataforma 
              conforme estes Termos. Você não pode:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Copiar ou reproduzir a Plataforma</li>
              <li>Modificar ou criar obras derivadas</li>
              <li>Vender ou transferir a licença</li>
              <li>Descompilar ou fazer engenharia reversa</li>
              <li>Remover avisos de direitos autorais</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">9.3 Conteúdo do Usuário</h3>
            <p className="text-slate-700 leading-relaxed">
              Você retém direitos sobre conteúdo que você cria (produtos, descrições, etc.). 
              Ao usar a Plataforma, você nos concede direito de usar esse conteúdo para fornecer os Serviços.
            </p>
          </section>

          {/* Limitação de Responsabilidade */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. Limitação de Responsabilidade</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">10.1 Isenção de Garantias</h3>
            <p className="text-slate-700 leading-relaxed">
              A Plataforma é fornecida "como está" sem garantias de qualquer tipo, expressas ou implícitas, 
              incluindo garantias de comercialização, adequação a um propósito específico ou não violação.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">10.2 Limitação de Danos</h3>
            <p className="text-slate-700 leading-relaxed">
              Em nenhuma circunstância seremos responsáveis por danos indiretos, incidentais, especiais, 
              consequentes ou punitivos, incluindo perda de lucros, dados ou reputação, mesmo que informados 
              da possibilidade de tais danos.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">10.3 Limite de Responsabilidade</h3>
            <p className="text-slate-700 leading-relaxed">
              Nossa responsabilidade total não excederá o valor pago por você nos últimos 12 meses.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">10.4 Exceções</h3>
            <p className="text-slate-700 leading-relaxed">
              Estas limitações não se aplicam a: morte, lesão pessoal, fraude, negligência grave ou 
              violações de direitos de propriedade intelectual.
            </p>
          </section>

          {/* Indenização */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">11. Indenização</h2>
            <p className="text-slate-700 leading-relaxed">
              Você concorda em indenizar, defender e isentar a Plataforma, seus diretores, funcionários 
              e agentes de qualquer reclamação, dano, perda ou despesa (incluindo honorários advocatícios) 
              decorrentes de:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Seu uso da Plataforma</li>
              <li>Violação destes Termos</li>
              <li>Violação de direitos de terceiros</li>
              <li>Conteúdo que você fornece</li>
              <li>Atividades ilegais ou não autorizadas</li>
            </ul>
          </section>

          {/* Suspensão e Encerramento */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">12. Suspensão e Encerramento</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">12.1 Direito de Suspensão</h3>
            <p className="text-slate-700 leading-relaxed">
              Podemos suspender ou encerrar sua conta se:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Você violar estes Termos</li>
              <li>Houver suspeita de fraude ou atividade ilegal</li>
              <li>Você não pagar as taxas devidas</li>
              <li>Você violar leis aplicáveis</li>
              <li>Houver risco de segurança ou dano</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">12.2 Procedimento</h3>
            <p className="text-slate-700 leading-relaxed">
              Quando possível, forneceremos aviso prévio. Em casos de emergência ou fraude, 
              podemos suspender imediatamente sem aviso.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">12.3 Consequências</h3>
            <p className="text-slate-700 leading-relaxed">
              Após encerramento, você perderá acesso à Plataforma. Dados podem ser retidos conforme 
              exigências legais. Você permanece responsável por obrigações pendentes.
            </p>
          </section>

          {/* Modificações */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">13. Modificações dos Termos</h2>
            <p className="text-slate-700 leading-relaxed">
              Podemos modificar estes Termos a qualquer momento. Notificaremos você sobre mudanças 
              significativas via email ou aviso na Plataforma. Seu uso continuado constitui aceitação 
              das modificações.
            </p>
          </section>

          {/* Disponibilidade */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">14. Disponibilidade e Manutenção</h2>
            <p className="text-slate-700 leading-relaxed">
              Embora nos esforcemos para manter a Plataforma disponível 24/7, não garantimos 
              disponibilidade ininterrupta. A Plataforma pode estar indisponível para:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4 mt-4">
              <li>Manutenção programada</li>
              <li>Atualizações de segurança</li>
              <li>Reparos de emergência</li>
              <li>Fatores fora de nosso controle</li>
            </ul>
          </section>

          {/* Contato */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">15. Contato e Suporte</h2>
            <p className="text-slate-700 leading-relaxed">
              Para dúvidas ou reclamações sobre estes Termos:
            </p>
            <div className="bg-slate-50 p-6 rounded-lg mt-4 border border-slate-200">
              <p className="text-slate-700"><strong>Email:</strong> support@sistema.com.br</p>
              <p className="text-slate-700 mt-2"><strong>Telefone:</strong> [Telefone da Empresa]</p>
              <p className="text-slate-700 mt-2"><strong>Endereço:</strong> [Endereço da Empresa]</p>
            </div>
          </section>

          {/* Lei Aplicável */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">16. Lei Aplicável e Jurisdição</h2>
            <p className="text-slate-700 leading-relaxed">
              Estes Termos são regidos pelas leis da República Federativa do Brasil. 
              Qualquer disputa será resolvida nos tribunais competentes do Brasil.
            </p>
          </section>

          {/* Disposições Finais */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">17. Disposições Finais</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">17.1 Integração</h3>
            <p className="text-slate-700 leading-relaxed">
              Estes Termos, juntamente com a Política de Privacidade, constituem o acordo integral 
              entre você e a Plataforma.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">17.2 Severabilidade</h3>
            <p className="text-slate-700 leading-relaxed">
              Se qualquer disposição for considerada inválida, as demais permanecerão em vigor.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">17.3 Renúncia</h3>
            <p className="text-slate-700 leading-relaxed">
              A falha em exercer qualquer direito não constitui renúncia a esse direito.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">17.4 Cessão</h3>
            <p className="text-slate-700 leading-relaxed">
              Você não pode ceder estes Termos sem consentimento prévio por escrito.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Ao usar esta Plataforma, você concorda com todos os termos e condições acima descritos.
          </p>
        </div>
      </div>
    </div>
  );
}
