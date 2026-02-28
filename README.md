# SomaAI Business - Frontend

Sistema de gestão empresarial desenvolvido com Next.js 14+ e TypeScript.

## 🚀 Stack Tecnológica

- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: Zustand
- **Formulários**: React Hook Form + Zod
- **API**: Axios + React Query
- **Gráficos**: Recharts
- **Tabelas**: TanStack Table

## 📁 Estrutura do Projeto

```
├── app/
│   ├── (auth)/          # Páginas de autenticação
│   ├── (dashboard)/     # Páginas do dashboard
│   └── api/             # API routes
├── components/
│   ├── dashboard/       # Componentes do dashboard
│   └── ui/              # Componentes UI reutilizáveis
├── lib/
│   ├── api/             # Serviços de API
│   ├── stores/          # Stores Zustand
│   ├── types/           # Definições TypeScript
│   └── utils/           # Funções utilitárias
└── public/              # Arquivos estáticos
```

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.local.example .env.local

# Executar em desenvolvimento
npm run dev
```

## 🔧 Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📦 Funcionalidades

- ✅ Gestão de Estabelecimentos
- ✅ Controle de Estoque
- ✅ PDV (Ponto de Venda)
- ✅ Gestão de Vendas
- ✅ Ofertas e Promoções
- ✅ Cadastro de Clientes
- ✅ Gestão de Fornecedores
- ✅ Relatórios e Análises

## 🎯 Próximos Passos

1. Implementar autenticação com NextAuth.js
2. Integrar com API backend
3. Adicionar componentes shadcn/ui
4. Implementar scanner de código de barras
5. Criar dashboards com gráficos
6. Adicionar sistema de permissões

## 📚 Documentação

Consulte o arquivo `docs/FRONTEND_GUIDE.md` para mais detalhes sobre a arquitetura e implementação.
