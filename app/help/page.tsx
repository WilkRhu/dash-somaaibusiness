'use client';

import Link from 'next/link';
import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    id: 'fiscal-1',
    category: 'Fiscal',
    question: 'Como emitir uma nota fiscal?',
    answer: 'Para emitir uma nota fiscal, acesse o menu Fiscal > Notas e clique em "Nova Nota". Preencha os dados do cliente, produtos/serviços e clique em "Emitir". O sistema validará automaticamente os dados antes de enviar para a Sefaz.',
  },
  {
    id: 'fiscal-2',
    category: 'Fiscal',
    question: 'Como fazer uma correção de nota fiscal?',
    answer: 'Acesse Fiscal > Notas, selecione a nota que deseja corrigir e clique em "Corrigir". Você pode emitir uma Carta de Correção (CC) ou uma Nota Fiscal de Devolução (NFe de devolução) conforme necessário.',
  },
  {
    id: 'fiscal-3',
    category: 'Fiscal',
    question: 'O que é contingência fiscal?',
    answer: 'Contingência é um modo de operação quando há problemas de comunicação com a Sefaz. Neste modo, você pode emitir notas em contingência que serão sincronizadas quando a conexão for restaurada. Acesse Fiscal > Contingência para ativar.',
  },
  {
    id: 'fiscal-4',
    category: 'Fiscal',
    question: 'Como desabilitar uma série de notas?',
    answer: 'Acesse Fiscal > Desabilitação para desabilitar uma série de notas. Isso é necessário quando você deseja parar de usar uma série específica. O sistema gerará um arquivo de desabilitação que deve ser enviado à Sefaz.',
  },
  {
    id: 'sales-1',
    category: 'Vendas',
    question: 'Como registrar uma venda?',
    answer: 'Acesse Vendas > PDV (Ponto de Venda) para registrar vendas em tempo real. Adicione produtos, aplique descontos se necessário e finalize a venda. O sistema pode gerar automaticamente uma nota fiscal se configurado.',
  },
  {
    id: 'sales-2',
    category: 'Vendas',
    question: 'Como gerar relatórios de vendas?',
    answer: 'Acesse Vendas > Relatórios para visualizar vendas por período, produto, cliente ou estabelecimento. Você pode filtrar dados e exportar em diferentes formatos.',
  },
  {
    id: 'inventory-1',
    category: 'Inventário',
    question: 'Como gerenciar o estoque?',
    answer: 'Acesse Inventário para visualizar e gerenciar produtos. Você pode adicionar novos produtos, atualizar quantidades, definir preços e gerenciar categorias.',
  },
  {
    id: 'inventory-2',
    category: 'Inventário',
    question: 'Como fazer uma contagem de estoque?',
    answer: 'Acesse Inventário e use a função de contagem. O sistema permite registrar a quantidade física e comparar com o sistema, gerando um relatório de divergências.',
  },
  {
    id: 'customers-1',
    category: 'Clientes',
    question: 'Como cadastrar um novo cliente?',
    answer: 'Acesse Clientes e clique em "Novo Cliente". Preencha os dados básicos (nome, CPF/CNPJ, contato) e salve. Você pode adicionar endereços e informações adicionais depois.',
  },
  {
    id: 'customers-2',
    category: 'Clientes',
    question: 'Como visualizar histórico de compras de um cliente?',
    answer: 'Acesse Clientes, selecione o cliente desejado e clique em "Histórico". Você verá todas as compras, devoluções e informações de crédito do cliente.',
  },
  {
    id: 'general-1',
    category: 'Geral',
    question: 'Como mudar de estabelecimento?',
    answer: 'Clique no nome do estabelecimento no topo da página (ao lado do seu nome). Uma lista de seus estabelecimentos aparecerá. Selecione o desejado para trocar.',
  },
  {
    id: 'general-2',
    category: 'Geral',
    question: 'Como atualizar meu perfil?',
    answer: 'Clique no seu avatar no canto superior direito e selecione "Meu Perfil". Você pode atualizar nome, email, foto de perfil e outras informações pessoais.',
  },
  {
    id: 'general-3',
    category: 'Geral',
    question: 'Como configurar certificado digital?',
    answer: 'Acesse Fiscal > Certificado para fazer upload do seu certificado digital (arquivo .pfx). O sistema usará este certificado para assinar digitalmente suas notas fiscais.',
  },
  {
    id: 'general-4',
    category: 'Geral',
    question: 'Qual é o horário de funcionamento do suporte?',
    answer: 'Nosso suporte está disponível de segunda a sexta, das 8h às 18h (horário de Brasília). Para problemas urgentes fora deste horário, você pode abrir um ticket que será atendido assim que possível.',
  },
];

const categories = ['Todos', 'Fiscal', 'Vendas', 'Inventário', 'Clientes', 'Geral'];

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQ = faqItems.filter((item) => {
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#142D4A] to-[#1a3a5c] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Centro de Ajuda</h1>
          <p className="text-lg text-gray-200">
            Encontre respostas para suas dúvidas sobre o sistema
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar na ajuda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4C99C2] focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[#4C99C2] text-white'
                  : 'bg-white text-[#142D4A] border border-gray-300 hover:border-[#4C99C2]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 text-left flex-1">
                    <div className="flex-shrink-0 mt-1">
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-[#4C99C2] bg-blue-50 rounded">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#142D4A]">{item.question}</h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-600 flex-shrink-0 ml-4 transition-transform ${
                      expandedId === item.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {expandedId === item.id && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500 text-lg">Nenhum resultado encontrado</p>
              <p className="text-gray-400 text-sm mt-2">Tente ajustar sua busca ou filtro</p>
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <div className="mt-16 bg-gradient-to-r from-[#4C99C2] to-[#7CBD6A] rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Não encontrou o que procurava?</h2>
          <p className="mb-6 text-lg">
            Entre em contato com nosso time de suporte. Estamos aqui para ajudar!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:suporte@exemplo.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#142D4A] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Enviar Email
            </a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#142D4A] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.732 5.41 2.124 7.738L2.505 22l8.227-2.158c2.215 1.21 4.708 1.848 7.273 1.848 9.735 0 17.412-7.675 17.412-17.41 0-4.655-1.782-9.025-5.014-12.3-3.23-3.275-7.593-5.08-12.204-5.08z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-[#4C99C2] hover:text-[#142D4A] font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
