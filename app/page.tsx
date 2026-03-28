'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import PricingPlans from '@/components/PricingPlans';

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
                src="https://somaaiuploads.s3.us-east-1.amazonaws.com/logomarca/logobusiness.png" 
                alt="SomaAI Business Logo" 
                width={40} 
                height={40}
                unoptimized
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
                href="/register"
                className="px-6 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-all font-semibold"
              >
                Criar Conta
              </Link>
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
                href="/register"
                className="block text-center px-6 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-all font-semibold"
              >
                Criar Conta
              </Link>
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
              <div className="w-14 h-14 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-brand-blue/10 rounded-xl">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-brand-navy mb-3">
                Controle de Estoque
              </h4>
              <p className="text-brand-navy/70">
                Gerencie produtos, alertas de estoque baixo, vencimentos e movimentações em tempo real.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 border-t-4 border-brand-green group">
              <div className="w-14 h-14 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-brand-green/10 rounded-xl">
                <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-brand-navy mb-3">
                PDV Completo
              </h4>
              <p className="text-brand-navy/70">
                Ponto de venda integrado com scanner de código de barras e múltiplas formas de pagamento.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 border-t-4 border-brand-blue group">
              <div className="w-14 h-14 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-brand-blue/10 rounded-xl">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-brand-navy mb-3">
                Ofertas e Promoções
              </h4>
              <p className="text-brand-navy/70">
                Crie e gerencie ofertas personalizadas para atrair e fidelizar clientes.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 border-t-4 border-brand-green group">
              <div className="w-14 h-14 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-brand-green/10 rounded-xl">
                <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-brand-navy mb-3">
                Relatórios Detalhados
              </h4>
              <p className="text-brand-navy/70">
                Análises completas de vendas, estoque, financeiro e comportamento de clientes.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 border-t-4 border-brand-blue group">
              <div className="w-14 h-14 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-brand-blue/10 rounded-xl">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-brand-navy mb-3">
                Gestão de Clientes
              </h4>
              <p className="text-brand-navy/70">
                Cadastro completo de clientes com histórico de compras e programa de fidelidade.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 border-t-4 border-brand-green group">
              <div className="w-14 h-14 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-brand-green/10 rounded-xl">
                <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold mb-2 drop-shadow-lg">1000+</div>
              <div className="text-lg opacity-90">Empresas Ativas</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold mb-2 drop-shadow-lg">50K+</div>
              <div className="text-lg opacity-90">Vendas/Mês</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold mb-2 drop-shadow-lg">200K+</div>
              <div className="text-lg opacity-90">Produtos Cadastrados</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-bold mb-2 drop-shadow-lg">99.9%</div>
              <div className="text-lg opacity-90">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-brand-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-brand-navy mb-4">
              O que nossos clientes dizem
            </h3>
            <p className="text-xl text-brand-navy/70">
              Empresas que confiam no SomaAI Business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-brand-navy/70 mb-6 italic">
                "O SomaAI revolucionou nossa gestão de estoque. Reduzimos perdas em 80% e ganhamos muito mais controle sobre as vendas."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-blue to-brand-green rounded-full flex items-center justify-center text-white font-bold">
                  JM
                </div>
                <div>
                  <p className="font-semibold text-brand-navy">João Martins</p>
                  <p className="text-sm text-brand-navy/60">Diretor, Mercado São João</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-brand-navy/70 mb-6 italic">
                "O PDV é incrivelmente rápido e intuitivo. Nossos caixas agora atendem o dobro de clientes no mesmo tempo."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-green to-brand-blue rounded-full flex items-center justify-center text-white font-bold">
                  RC
                </div>
                <div>
                  <p className="font-semibold text-brand-navy">Roberta Costa</p>
                  <p className="text-sm text-brand-navy/60">Gerente, Padaria Bella</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-brand-navy/70 mb-6 italic">
                "Os relatórios me ajudam a tomar decisões muito mais assertivas. O programa de fidelidade aumentou nossas vendas em 25%."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-blue to-brand-green rounded-full flex items-center justify-center text-white font-bold">
                  PL
                </div>
                <div>
                  <p className="font-semibold text-brand-navy">Pedro Lima</p>
                  <p className="text-sm text-brand-navy/60">Proprietário, Lanchonete Top</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-brand-navy/50 text-sm mb-8">Confiado por empresas em todo o Brasil</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-semibold text-brand-navy">LGPD Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-semibold text-brand-navy">SSL Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-semibold text-brand-navy">Alta Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-semibold text-brand-navy">Suporte 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-semibold text-brand-navy">Backup Diário</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-brand-navy mb-4">
              Perguntas Frequentes
            </h3>
            <p className="text-xl text-brand-navy/70">
              Tire suas dúvidas sobre o SomaAI Business
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'O SomaAI Business tem período de teste gratuito?',
                a: 'Sim! Oferecemos 14 dias de teste gratuito sem necessidade de cartão de crédito. Você terá acesso a todos os recursos do plano Profissional.'
              },
              {
                q: 'Posso mudar de plano depois?',
                a: 'Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações entram em vigor na próxima fatura.'
              },
              {
                q: 'Meus dados estão seguros no SomaAI?',
                a: 'Sim! Utilizamos criptografia de ponta a ponta, backup diário automático e estamos em conformidade com a LGPD. Seus dados são armazenados em servidores seguros no Brasil.'
              },
              {
                q: 'Preciso de conhecimento técnico para usar?',
                a: 'Não! O SomaAI Business foi projetado para ser intuitivo e fácil de usar. Oferecemos tutoriais em vídeo e suporte para ajudá-lo em cada etapa.'
              },
              {
                q: 'O sistema funciona offline?',
                a: 'Sim! O PDV e principais funcionalidades funcionam offline e sincronizam automaticamente quando a conexão é restaurada.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6">
                <h4 className="font-semibold text-brand-navy mb-2">{faq.q}</h4>
                <p className="text-brand-navy/70">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-brand-navy mb-6">
                Sobre o SomaAI Business
              </h3>
              <p className="text-brand-navy/70 mb-4">
                Fundado em 2025, o SomaAI Business nasceu da necessidade de simplificar a gestão de pequenos e médios negócios no Brasil.
              </p>
              <p className="text-brand-navy/70 mb-4">
                Nossa missão é democratizar o acesso a ferramentas de gestão empresarial de alta qualidade, permitindo que qualquer empreendedor tome decisões baseadas em dados.
              </p>
              <p className="text-brand-navy/70 mb-6">
                Hoje, ajudamos mais de 1.000 empresas a otimizar suas operações, aumentar vendas e fidelizar clientes.
              </p>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-blue">2023</div>
                  <div className="text-sm text-brand-navy/60">Fundação</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-green">1000+</div>
                  <div className="text-sm text-brand-navy/60">Clientes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-blue">50+</div>
                  <div className="text-sm text-brand-navy/60">Cidades</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-brand-blue/10 to-brand-green/10 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-6 text-center shadow-md">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-brand-navy">Equipe</p>
                    <p className="text-sm text-brand-navy/60">25 profissionais</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center shadow-md">
                    <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="font-semibold text-brand-navy">Escritório</p>
                    <p className="text-sm text-brand-navy/60">Paulista, PE</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center shadow-md">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-brand-navy">Missão</p>
                    <p className="text-sm text-brand-navy/60">Simplificar gestão</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center shadow-md">
                    <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-brand-navy">Investimento</p>
                    <p className="text-sm text-brand-navy/60">Acessível</p>
                  </div>
                </div>
              </div>
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

          <PricingPlans />
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg"
            >
              Criar Conta Grátis
            </Link>
            <Link
              href="/login"
              className="inline-block px-8 py-4 border-2 border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-all font-semibold text-lg"
            >
              Já tenho conta
            </Link>
          </div>
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
            <p>&copy; {new Date().getFullYear()} SomaAI Business. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
