'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image 
                src="/images/logo.png" 
                alt="SomaAI Business Logo" 
                width={40} 
                height={40}
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
                SomaAI Business
              </h1>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-brand-navy hover:text-brand-blue transition-colors">
                Recursos
              </a>
              <a href="#pricing" className="text-brand-navy hover:text-brand-blue transition-colors">
                Planos
              </a>
              <a href="#contact" className="text-brand-navy hover:text-brand-blue transition-colors">
                Contato
              </a>
              <Link 
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Entrar
              </Link>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-brand-navy hover:text-brand-blue">
                Recursos
              </a>
              <a href="#pricing" className="block text-brand-navy hover:text-brand-blue">
                Planos
              </a>
              <a href="#contact" className="block text-brand-navy hover:text-brand-blue">
                Contato
              </a>
              <Link 
                href="/login"
                className="block text-center px-6 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg"
              >
                Entrar
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background com gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4C99C2] via-[#7CBD6A] to-[#4C99C2] opacity-10 animate-gradient"></div>
        
        {/* Overlay com gradiente suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F7F9]/90 via-white/80 to-[#EBF5FA]/90"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(76, 153, 194, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(76, 153, 194, 0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Círculos animados com gradiente */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl animate-pulse" style={{
          background: 'radial-gradient(circle, rgba(76, 153, 194, 0.3) 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{
          background: 'radial-gradient(circle, rgba(124, 189, 106, 0.3) 0%, transparent 70%)',
          animationDelay: '1s'
        }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse" style={{
          background: 'radial-gradient(circle, rgba(76, 153, 194, 0.15) 0%, rgba(124, 189, 106, 0.15) 50%, transparent 70%)',
          animationDelay: '2s'
        }}></div>
        
        {/* Elementos flutuantes */}
        <div className="absolute top-32 left-20 w-20 h-20 border-2 border-[#4C99C2]/30 rounded-lg rotate-12 animate-float"></div>
        <div className="absolute bottom-40 right-32 w-16 h-16 border-2 border-[#7CBD6A]/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/3 right-20 w-12 h-12 rounded-lg rotate-45 animate-float" style={{
          background: 'linear-gradient(135deg, rgba(76, 153, 194, 0.2) 0%, rgba(124, 189, 106, 0.2) 100%)',
          animationDelay: '0.5s'
        }}></div>
        
        <div className="max-w-7xl mx-auto text-center py-20 relative z-10">
          <div className="mb-8 inline-block">
            <span className="px-4 py-2 bg-gradient-to-r from-[#4C99C2] to-[#7CBD6A] text-white rounded-full text-sm font-semibold">
              🚀 Sistema de Gestão Completo
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#142D4A] mb-8 leading-tight">
            Gestão Inteligente
            <span className="block bg-gradient-to-r from-[#4C99C2] to-[#7CBD6A] bg-clip-text text-transparent">
              para Seu Negócio
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#142D4A]/70 mb-12 max-w-4xl mx-auto leading-relaxed">
            Sistema completo de gestão empresarial com controle de estoque, vendas, 
            ofertas e relatórios em tempo real. Simplifique sua operação e aumente seus resultados.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="px-10 py-5 bg-gradient-to-r from-[#4C99C2] to-[#7CBD6A] text-white rounded-xl hover:opacity-90 hover:scale-105 transition-all font-semibold text-lg shadow-lg"
            >
              Começar Agora Grátis
            </Link>
            <a
              href="#features"
              className="px-10 py-5 border-2 border-[#4C99C2] text-[#142D4A] rounded-xl hover:bg-[#4C99C2]/5 hover:scale-105 transition-all font-semibold text-lg"
            >
              Conhecer Recursos
            </a>
          </div>

          {/* Stats rápidos */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-8 border-t border-[#142D4A]/10">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#4C99C2] mb-1">1000+</div>
              <div className="text-sm text-[#142D4A]/60">Empresas</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#7CBD6A] mb-1">50K+</div>
              <div className="text-sm text-[#142D4A]/60">Vendas/mês</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#4C99C2] mb-1">99.9%</div>
              <div className="text-sm text-[#142D4A]/60">Uptime</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a 
          href="#features" 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <div className="w-6 h-10 border-2 border-[#4C99C2] rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-[#4C99C2] rounded-full"></div>
          </div>
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-brand-background relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(76, 153, 194, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(124, 189, 106, 0.1) 0%, transparent 50%)`
        }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-brand-navy mb-4">
              Tudo que você precisa em um só lugar
            </h3>
            <p className="text-xl text-brand-navy/70">
              Recursos completos para gestão eficiente do seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 border-t-4 border-brand-blue group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📦</div>
              <h4 className="text-2xl font-bold text-brand-navy mb-3">
                Controle de Estoque
              </h4>
              <p className="text-brand-navy/70">
                Gerencie produtos, alertas de estoque baixo, vencimentos e movimentações em tempo real.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 border-t-4 border-brand-green group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">💰</div>
              <h4 className="text-2xl font-bold text-brand-navy mb-3">
                PDV Completo
              </h4>
              <p className="text-brand-navy/70">
                Ponto de venda integrado com scanner de código de barras e múltiplas formas de pagamento.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 border-t-4 border-brand-blue group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎁</div>
              <h4 className="text-2xl font-bold text-brand-navy mb-3">
                Ofertas e Promoções
              </h4>
              <p className="text-brand-navy/70">
                Crie e gerencie ofertas personalizadas para atrair e fidelizar clientes.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 border-t-4 border-brand-green group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📈</div>
              <h4 className="text-2xl font-bold text-brand-navy mb-3">
                Relatórios Detalhados
              </h4>
              <p className="text-brand-navy/70">
                Análises completas de vendas, estoque, financeiro e comportamento de clientes.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 border-t-4 border-brand-blue group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👥</div>
              <h4 className="text-2xl font-bold text-brand-navy mb-3">
                Gestão de Clientes
              </h4>
              <p className="text-brand-navy/70">
                Cadastro completo de clientes com histórico de compras e programa de fidelidade.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 border-t-4 border-brand-green group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🏪</div>
              <h4 className="text-2xl font-bold text-brand-navy mb-3">
                Multi-estabelecimentos
              </h4>
              <p className="text-brand-navy/70">
                Gerencie múltiplas lojas em uma única plataforma com controle de permissões.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-brand-blue via-brand-green to-brand-blue animate-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-6xl font-bold mb-2 drop-shadow-lg">1000+</div>
              <div className="text-xl opacity-90">Empresas Ativas</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-6xl font-bold mb-2 drop-shadow-lg">50K+</div>
              <div className="text-xl opacity-90">Vendas Processadas</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-6xl font-bold mb-2 drop-shadow-lg">99.9%</div>
              <div className="text-xl opacity-90">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-brand-navy mb-4">
              Planos para todos os tamanhos
            </h3>
            <p className="text-xl text-brand-navy/70">
              Escolha o plano ideal para o seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 hover:border-brand-blue transition-colors">
              <h4 className="text-2xl font-bold text-brand-navy mb-2">Básico</h4>
              <div className="text-4xl font-bold text-brand-blue mb-6">
                R$ 49<span className="text-lg text-brand-navy/70">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-brand-green text-xl">✓</span>
                  <span className="text-brand-navy/70">Até 100 produtos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-green text-xl">✓</span>
                  <span className="text-brand-navy/70">2 usuários</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-green text-xl">✓</span>
                  <span className="text-brand-navy/70">1 estabelecimento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-green text-xl">✓</span>
                  <span className="text-brand-navy/70">Relatórios básicos</span>
                </li>
              </ul>
              <button className="w-full px-6 py-3 border-2 border-brand-blue text-brand-navy rounded-lg hover:bg-brand-blue/5 transition-colors font-semibold">
                Começar
              </button>
            </div>

            <div className="bg-gradient-to-br from-brand-blue to-brand-green rounded-xl shadow-xl p-8 text-white transform scale-105">
              <div className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                MAIS POPULAR
              </div>
              <h4 className="text-2xl font-bold mb-2">Profissional</h4>
              <div className="text-4xl font-bold mb-6">
                R$ 99<span className="text-lg opacity-90">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-xl">✓</span>
                  <span className="opacity-90">Até 1000 produtos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">✓</span>
                  <span className="opacity-90">5 usuários</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">✓</span>
                  <span className="opacity-90">3 estabelecimentos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">✓</span>
                  <span className="opacity-90">Relatórios avançados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">✓</span>
                  <span className="opacity-90">Programa de fidelidade</span>
                </li>
              </ul>
              <button className="w-full px-6 py-3 bg-white text-brand-blue rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                Começar
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 hover:border-brand-green transition-colors">
              <h4 className="text-2xl font-bold text-brand-navy mb-2">Enterprise</h4>
              <div className="text-4xl font-bold text-brand-green mb-6">
                R$ 199<span className="text-lg text-brand-navy/70">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-brand-green text-xl">✓</span>
                  <span className="text-brand-navy/70">Produtos ilimitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-green text-xl">✓</span>
                  <span className="text-brand-navy/70">Usuários ilimitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-green text-xl">✓</span>
                  <span className="text-brand-navy/70">Estabelecimentos ilimitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-green text-xl">✓</span>
                  <span className="text-brand-navy/70">Todos os recursos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-green text-xl">✓</span>
                  <span className="text-brand-navy/70">Suporte prioritário</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-green text-xl">✓</span>
                  <span className="text-brand-navy/70">API Access</span>
                </li>
              </ul>
              <button className="w-full px-6 py-3 border-2 border-brand-green text-brand-navy rounded-lg hover:bg-brand-green/5 transition-colors font-semibold">
                Começar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-brand-navy mb-6">
            Pronto para transformar seu negócio?
          </h3>
          <p className="text-xl text-brand-navy/70 mb-8">
            Comece gratuitamente hoje e veja como o SomaAI Business pode revolucionar sua gestão.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg"
          >
            Começar Gratuitamente
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-brand-navy text-white py-12">
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
                <li><a href="#features" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
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
            <p>&copy; 2024 SomaAI Business. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
