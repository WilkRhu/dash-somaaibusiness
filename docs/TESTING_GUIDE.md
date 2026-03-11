# Guia de Testes - Sistema Fiscal

## Visão Geral

Este documento descreve a estratégia de testes para o sistema fiscal, incluindo testes unitários, testes de integração e testes E2E.

## Estrutura de Testes

```
__tests__/
├── lib/
│   └── utils/
│       ├── fiscal-formatters.test.ts
│       └── fiscal-validators.test.ts
├── components/
│   └── fiscal/
│       └── metric-card.test.tsx
└── integration/
    └── fiscal-workflow.test.ts
```

## Configuração

### Dependências

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### Arquivos de Configuração

- `jest.config.js` - Configuração do Jest
- `jest.setup.js` - Setup de testes (mocks, configurações globais)

## Executando Testes

### Todos os testes
```bash
npm test
```

### Testes específicos
```bash
npm test -- fiscal-formatters.test.ts
```

### Testes com cobertura
```bash
npm test -- --coverage
```

### Modo watch
```bash
npm test -- --watch
```

## Testes Unitários

### Formatadores (`fiscal-formatters.test.ts`)

Testa funções de formatação:
- `formatCurrency()` - Formatação de moeda
- `formatCPF()` - Formatação de CPF
- `formatCNPJ()` - Formatação de CNPJ
- `formatDate()` - Formatação de data
- `formatDateTime()` - Formatação de data e hora
- `formatNoteStatus()` - Formatação de status
- `formatNoteType()` - Formatação de tipo de nota
- `isCertificateExpired()` - Verificação de expiração
- `isCertificateExpiringSoon()` - Verificação de expiração próxima

**Cobertura esperada**: 100%

### Validadores (`fiscal-validators.test.ts`)

Testa funções de validação:
- `validateCPF()` - Validação de CPF
- `validateCNPJ()` - Validação de CNPJ
- `validateEmail()` - Validação de email
- `validateNCM()` - Validação de NCM
- `validateCFOP()` - Validação de CFOP
- `validateNumberRange()` - Validação de intervalo
- `validateDisablementJustification()` - Validação de justificativa

**Cobertura esperada**: 100%

### Componentes (`metric-card.test.tsx`)

Testa componentes React:
- Renderização correta
- Props obrigatórias e opcionais
- Aplicação de estilos
- Comportamento interativo

**Cobertura esperada**: 80%+

## Testes de Integração

### Workflow Fiscal (`fiscal-workflow.test.ts`)

Testa fluxos completos:

1. **Gerenciamento de Certificado**
   - Upload e validação
   - Detecção de expiração
   - Alertas de expiração próxima

2. **Emissão de Nota**
   - Emissão com dados válidos
   - Validação de itens
   - Cálculo de totais

3. **Gestão de Nota**
   - Rastreamento de status
   - Permissão de correção
   - Permissão de cancelamento

4. **Rastreamento de Conformidade**
   - Cálculo de taxa de conformidade
   - Identificação de vendas sem nota
   - Rastreamento de taxa de rejeição

5. **Modo de Contingência**
   - Emissão offline
   - Transmissão quando online

6. **Exportação e Relatórios**
   - Exportação em Excel
   - Geração de relatório de conformidade

## Testes E2E (Recomendado)

### Ferramentas Sugeridas
- Cypress
- Playwright
- Puppeteer

### Cenários de Teste

1. **Fluxo de Certificado**
   ```
   1. Acessar página de certificado
   2. Fazer upload de certificado
   3. Validar certificado
   4. Verificar status
   ```

2. **Fluxo de Emissão de Nota**
   ```
   1. Acessar página de emissão
   2. Preencher dados da nota
   3. Adicionar itens
   4. Emitir nota
   5. Verificar autorização
   ```

3. **Fluxo de Conformidade**
   ```
   1. Acessar página de conformidade
   2. Visualizar vendas sem nota
   3. Selecionar vendas
   4. Emitir notas em lote
   5. Verificar atualização
   ```

## Cobertura de Testes

### Metas de Cobertura

| Tipo | Meta |
|------|------|
| Statements | 50%+ |
| Branches | 50%+ |
| Functions | 50%+ |
| Lines | 50%+ |

### Verificar Cobertura

```bash
npm test -- --coverage
```

Relatório será gerado em `coverage/`

## Boas Práticas

### 1. Nomenclatura
```typescript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // test code
  })
})
```

### 2. Arrange-Act-Assert
```typescript
it('should format currency correctly', () => {
  // Arrange
  const value = 1000

  // Act
  const result = formatCurrency(value)

  // Assert
  expect(result).toBe('R$ 1.000,00')
})
```

### 3. Testes Independentes
- Cada teste deve ser independente
- Não depender de ordem de execução
- Limpar estado após cada teste

### 4. Mocks e Stubs
```typescript
jest.mock('@/lib/api/fiscal', () => ({
  fiscalApi: {
    emitNote: jest.fn(),
  },
}))
```

## Debugging

### Modo Debug
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Logs em Testes
```typescript
it('should do something', () => {
  console.log('Debug info:', data)
  expect(data).toBeDefined()
})
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

## Troubleshooting

### Erro: "Cannot find module"
- Verificar alias em `jest.config.js`
- Verificar `tsconfig.json`

### Erro: "ReferenceError: window is not defined"
- Usar `jest-environment-jsdom`
- Verificar `jest.setup.js`

### Erro: "act() warning"
- Envolver atualizações de estado em `act()`
- Usar `waitFor()` para operações assíncronas

## Recursos

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Próximos Passos

1. Adicionar mais testes de componentes
2. Implementar testes E2E com Cypress
3. Configurar CI/CD com GitHub Actions
4. Aumentar cobertura para 80%+
5. Adicionar testes de performance
