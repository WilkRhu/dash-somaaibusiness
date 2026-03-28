import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de Privacidade do Sistema de Gestão Fiscal e Pagamentos',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="https://somaaiuploads.s3.us-east-1.amazonaws.com/logomarca/logobusiness.png" 
                alt="SomaAI Business Logo" 
                width={40} 
                height={40}
                unoptimized
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
                SomaAI Business
              </h1>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-brand-navy hover:text-brand-blue transition-colors">
                Voltar
              </Link>
              <Link 
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Entrar
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-brand-navy mb-4">Política de Privacidade</h1>
            <p className="text-lg text-brand-navy/70">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="space-y-8 text-brand-navy/80">
            {/* Introdução */}
            <section>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">1. Introdução</h2>
              <p className="text-brand-navy/70 leading-relaxed">
                A presente Política de Privacidade ("Política") descreve como o Sistema de Gestão Fiscal e Pagamentos 
                ("Plataforma", "nós", "nosso") coleta, utiliza, processa e protege os dados pessoais dos usuários 
                ("você", "usuário", "cliente").
              </p>
              <p className="text-brand-navy/70 leading-relaxed mt-4">
                Estamos comprometidos em proteger sua privacidade e garantir que você tenha uma experiência positiva 
                em nossa Plataforma. Esta Política se aplica a todos os usuários, incluindo proprietários de 
                estabelecimentos, gerentes, entregadores e clientes finais.
              </p>
            </section>

            {/* Dados Coletados */}
            <section>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">2. Dados que Coletamos</h2>
              
              <h3 className="text-2xl font-semibold text-brand-navy mt-6 mb-3">2.1 Dados de Identificação</h3>
              <ul className="list-disc list-inside text-brand-navy/70 space-y-2 ml-4">
                <li>Nome completo</li>
                <li>Email</li>
                <li>Número de telefone</li>
                <li>CPF/CNPJ</li>
                <li>Data de nascimento</li>
                <li>Endereço completo</li>
              </ul>

              <h3 className="text-2xl font-semibold text-brand-navy mt-6 mb-3">2.2 Dados Comerciais e Fiscais</h3>
              <ul className="list-disc list-inside text-brand-navy/70 space-y-2 ml-4">
                <li>Informações do estabelecimento</li>
                <li>Dados de inscrição estadual e municipal</li>
                <li>Certificados digitais (e-CNPJ)</li>
                <li>Histórico de vendas e transações</li>
                <li>Notas fiscais eletrônicas</li>
                <li>Dados de inventário e produtos</li>
              </ul>

              <h3 className="text-2xl font-semibold text-brand-navy mt-6 mb-3">2.3 Dados de Pagamento</h3>
              <ul className="list-disc list-inside text-brand-navy/70 space-y-2 ml-4">
                <li>Informações de cartão de crédito/débito (processadas de forma segura)</li>
                <li>Dados bancários para transferências</li>
                <li>Histórico de transações e pagamentos</li>
                <li>Informações de faturamento</li>
              </ul>

              <h3 className="text-2xl font-semibold text-brand-navy mt-6 mb-3">2.4 Dados de Entrega</h3>
              <ul className="list-disc list-inside text-brand-navy/70 space-y-2 ml-4">
                <li>Localização GPS em tempo real</li>
                <li>Rotas de entrega</li>
                <li>Dados de clientes finais (nome, endereço, telefone)</li>
                <li>Histórico de entregas</li>
              </ul>

              <h3 className="text-2xl font-semibold text-brand-navy mt-6 mb-3">2.5 Dados Técnicos</h3>
              <ul className="list-disc list-inside text-brand-navy/70 space-y-2 ml-4">
                <li>Endereço IP</li>
                <li>Tipo de navegador e dispositivo</li>
                <li>Cookies e tecnologias similares</li>
                <li>Logs de acesso e atividades</li>
                <li>Dados de uso da Plataforma</li>
              </ul>
            </section>

            {/* Base Legal */}
            <section>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">3. Base Legal para Processamento</h2>
              <p className="text-brand-navy/70 leading-relaxed">
                Processamos seus dados pessoais com base nas seguintes fundamentações legais:
              </p>
              <ul className="list-disc list-inside text-brand-navy/70 space-y-2 ml-4 mt-4">
                <li><strong>Execução de Contrato:</strong> Para fornecer os serviços contratados</li>
                <li><strong>Obrigação Legal:</strong> Para cumprir com leis fiscais, trabalhistas e regulatórias</li>
                <li><strong>Interesse Legítimo:</strong> Para melhorar nossos serviços e segurança</li>
                <li><strong>Consentimento:</strong> Para comunicações de marketing e análises adicionais</li>
                <li><strong>Proteção de Direitos:</strong> Para proteger direitos legais e segurança</li>
              </ul>
            </section>

            {/* Uso dos Dados */}
            <section>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">4. Como Utilizamos Seus Dados</h2>
              <ul className="list-disc list-inside text-brand-navy/70 space-y-2 ml-4">
                <li>Fornecer e manter os serviços da Plataforma</li>
                <li>Processar transações e pagamentos</li>
                <li>Gerar documentos fiscais (NF-e, NFC-e, etc.)</li>
                <li>Gerenciar entregas e logística</li>
                <li>Comunicações sobre sua conta e serviços</li>
                <li>Suporte ao cliente e resolução de problemas</li>
                <li>Análise de dados e melhorias de serviço</li>
                <li>Conformidade com obrigações legais e regulatórias</li>
                <li>Prevenção de fraude e segurança</li>
                <li>Marketing e comunicações promocionais (com consentimento)</li>
              </ul>
            </section>

            {/* Compartilhamento de Dados */}
            <section>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">5. Compartilhamento de Dados</h2>
              <p className="text-brand-navy/70 leading-relaxed">
                Podemos compartilhar seus dados com:
              </p>
              <ul className="list-disc list-inside text-brand-navy/70 space-y-2 ml-4 mt-4">
                <li><strong>Autoridades Fiscais:</strong> SEFAZ, Receita Federal, prefeituras</li>
                <li><strong>Provedores de Pagamento:</strong> MercadoPago, bancos e processadores</li>
                <li><strong>Prestadores de Serviço:</strong> Hospedagem, análise, suporte técnico</li>
                <li><strong>Parceiros Comerciais:</strong> Integrações autorizadas</li>
                <li><strong>Autoridades Legais:</strong> Quando exigido por lei</li>
                <li><strong>Clientes Finais:</strong> Informações necessárias para entrega</li>
              </ul>
              <p className="text-brand-navy/70 leading-relaxed mt-4">
                Todos os terceiros são obrigados a manter a confidencialidade e segurança dos dados.
              </p>
            </section>

            {/* Segurança */}
            <section>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">6. Segurança dos Dados</h2>
              <p className="text-brand-navy/70 leading-relaxed">
                Implementamos medidas técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="list-disc list-inside text-brand-navy/70 space-y-2 ml-4 mt-4">
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Criptografia de dados em repouso</li>
                <li>Autenticação multifator</li>
                <li>Firewalls e sistemas de detecção de intrusão</li>
                <li>Backups regulares e planos de recuperação</li>
                <li>Acesso restrito a dados pessoais</li>
                <li>Auditorias de segurança regulares</li>
                <li>Conformidade com PCI DSS para dados de pagamento</li>
              </ul>
              <p className="text-brand-navy/70 leading-relaxed mt-4">
                Apesar de nossos esforços, nenhum sistema é 100% seguro. Você é responsável por manter sua senha confidencial.
              </p>
            </section>

            {/* Retenção de Dados */}
            <section>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">7. Retenção de Dados</h2>
              <p className="text-brand-navy/70 leading-relaxed">
                Retemos seus dados pessoais pelo tempo necessário para:
              </p>
              <ul className="list-disc list-inside text-brand-navy/70 space-y-2 ml-4 mt-4">
                <li>Fornecer os serviços contratados</li>
                <li>Cumprir obrigações legais (até 5 anos para dados fiscais)</li>
                <li>Resolver disputas e reclamações</li>
                <li>Proteger direitos legais</li>
              </ul>
              <p className="text-brand-navy/70 leading-relaxed mt-4">
                Após esse período, os dados serão deletados ou anonimizados, exceto quando a lei exigir retenção prolongada.
              </p>
            </section>

            {/* Direitos do Usuário */}
            <section>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">8. Seus Direitos (LGPD)</h2>
              <p className="text-brand-navy/70 leading-relaxed">
                Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
              </p>
              <ul className="list-disc list-inside text-brand-navy/70 space-y-2 ml-4 mt-4">
                <li><strong>Acesso:</strong> Solicitar cópia de seus dados pessoais</li>
                <li><strong>Correção:</strong> Corrigir dados imprecisos ou incompletos</li>
                <li><strong>Exclusão:</strong> Solicitar exclusão de dados (direito ao esquecimento)</li>
                <li><strong>Portabilidade:</strong> Receber dados em formato estruturado</li>
                <li><strong>Oposição:</strong> Opor-se ao processamento de dados</li>
                <li><strong>Revogação de Consentimento:</strong> Retirar consentimento a qualquer momento</li>
                <li><strong>Informação:</strong> Ser informado sobre processamento de dados</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">9. Cookies e Tecnologias Similares</h2>
              <p className="text-brand-navy/70 leading-relaxed">
                Utilizamos cookies para:
              </p>
              <ul className="list-disc list-inside text-brand-navy/70 space-y-2 ml-4 mt-4">
                <li>Manter você conectado</li>
                <li>Lembrar preferências</li>
                <li>Análise de uso e melhorias</li>
                <li>Publicidade direcionada</li>
              </ul>
              <p className="text-brand-navy/70 leading-relaxed mt-4">
                Você pode controlar cookies através das configurações do seu navegador.
              </p>
            </section>

            {/* Contato */}
            <section>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">10. Contato e Exercício de Direitos</h2>
              <p className="text-brand-navy/70 leading-relaxed">
                Para exercer seus direitos ou fazer perguntas sobre esta Política, entre em contato:
              </p>
              <div className="bg-brand-background p-6 rounded-lg mt-4 border border-brand-blue/20">
                <p className="text-brand-navy"><strong>Email:</strong> privacy@sistema.com.br</p>
                <p className="text-brand-navy mt-2"><strong>Encarregado de Dados (DPO):</strong> dpo@sistema.com.br</p>
                <p className="text-brand-navy mt-2"><strong>Endereço:</strong> [Endereço da Empresa]</p>
                <p className="text-brand-navy mt-2"><strong>Telefone:</strong> [Telefone da Empresa]</p>
              </div>
            </section>

            {/* Alterações */}
            <section>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">11. Alterações nesta Política</h2>
              <p className="text-brand-navy/70 leading-relaxed">
                Podemos atualizar esta Política periodicamente. Notificaremos você sobre mudanças significativas 
                via email ou através de um aviso destacado na Plataforma. Seu uso continuado da Plataforma após 
                as alterações constitui aceitação da Política revisada.
              </p>
            </section>

            {/* Lei Aplicável */}
            <section>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">12. Lei Aplicável</h2>
              <p className="text-brand-navy/70 leading-relaxed">
                Esta Política é regida pelas leis da República Federativa do Brasil, especialmente pela Lei Geral 
                de Proteção de Dados (Lei nº 13.709/2018) e legislação fiscal aplicável.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-brand-blue/20">
            <p className="text-sm text-brand-navy/60">
              Ao usar esta Plataforma, você concorda com os termos desta Política de Privacidade.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-xl font-bold mb-4 bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
                SomaAI Business
              </h5>
              <p className="text-white/70">
                Gestão inteligente para seu negócio crescer.
              </p>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Produto</h6>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Termos</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacidade</Link></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Empresa</h6>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Suporte</h6>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/70">
            <p>&copy; {new Date().getFullYear()} SomaAI Business. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
