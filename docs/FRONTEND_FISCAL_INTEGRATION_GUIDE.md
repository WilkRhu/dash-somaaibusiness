# Guia de Integração Frontend - Sistema Fiscal

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Rotas da API](#rotas-da-api)
4. [Modelos de Dados](#modelos-de-dados)
5. [Fluxos de Tela](#fluxos-de-tela)
6. [Componentes Sugeridos](#componentes-sugeridos)
7. [Estados e Validações](#estados-e-validações)
8. [Tratamento de Erros](#tratamento-de-erros)

---

## Visão Geral

Este documento detalha todas as rotas, campos e funcionalidades necessárias para implementar o módulo fiscal no frontend.

**Base URL**: `http://localhost:3000/api` (desenvolvimento)

**Autenticação**: Todas as rotas requerem token JWT no header:
```
Authorization: Bearer {token}
```

---

## Autenticação

### Login
```typescript
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha"
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "establishmentId": "uuid"
  }
}
```

---

## Rotas da API

### 1. Certificados Digitais

#### 1.1 Upload de Certificado
```typescript
POST /business/fiscal/certificate/upload
Content-Type: application/json

{
  "certificateBase64": "MIIJrQIBAzCCCXcGCSqGSIb3DQEBBQAwggluMIIFZAIBATA...",
  "password": "senha_do_certificado"
}

// Response
{
  "id": "uuid",
  "establishmentId": "uuid",
  "expiryDate": "2027-03-10",
  "issuer": "Certisign",
  "subject": "CNPJ:12345678901234",
  "createdAt": "2026-03-10T10:00:00Z"
}
```

**Campos do Formulário**:
- `certificateFile`: File (input type="file" accept=".pfx,.p12")
- `password`: string (input type="password", required, min 4 chars)

**Validações**:
- Arquivo obrigatório
- Senha obrigatória
- Formato .pfx ou .p12
- Tamanho máximo: 5MB

#### 1.2 Consultar Certificado
```typescript
GET /business/fiscal/certificate

// Response
{
  "id": "uuid",
  "establishmentId": "uuid",
  "type": "A1",
  "cnpj": "12.345.678/0001-90",
  "holderName": "EMPRESA EXEMPLO LTDA",
  "expiresAt": "2027-02-28T23:59:59.000Z",
  "isActive": true,
  "daysUntilExpiration": 365,
  "createdAt": "2026-02-28T10:30:00.000Z"
}
```

#### 1.3 Validar Certificado
```typescript
GET /business/fiscal/certificate/validate

// Response
{
  "valid": true,
  "cnpj": "12.345.678/0001-90",
  "holderName": "EMPRESA EXEMPLO LTDA",
  "expiresAt": "2027-02-28T23:59:59.000Z",
  "daysUntilExpiration": 365,
  "isExpired": false,
  "needsRenewal": false
}
```


### 2. Notas Fiscais

#### 2.1 Emitir Nota Fiscal (NFC-e)
```typescript
POST /business/fiscal/notes
Content-Type: application/json

{
  "type": "nfce", // ou "nfe"
  "saleId": "uuid-da-venda", // opcional
  "recipient": {
    "cpfCnpj": "12345678901234",
    "name": "Cliente Exemplo",
    "email": "cliente@email.com",
    "phone": "(11) 98765-4321"
  },
  "items": [
    {
      "code": "7891234567890",
      "description": "Produto Exemplo",
      "ncm": "12345678",
      "cfop": "5102",
      "unit": "UN",
      "quantity": 2,
      "unitPrice": 10.00,
      "total": 20.00,
      "taxes": {
        "icms": 0,
        "pis": 0,
        "cofins": 0
      }
    }
  ],
  "totals": {
    "products": 20.00,
    "discount": 0,
    "total": 20.00,
    "taxes": {
      "icms": 0,
      "pis": 0,
      "cofins": 0
    }
  },
  "additionalInfo": "Observações adicionais",
  "series": "1"
}

// Response (Autorizada)
{
  "id": "uuid",
  "establishmentId": "uuid",
  "type": "nfce",
  "status": "authorized",
  "number": "000123",
  "series": "1",
  "accessKey": "35260212345678000190650010001230001234567890",
  "authorizationProtocol": "135260000123456",
  "authorizedAt": "2026-02-28T10:35:00.000Z",
  "danfeUrl": "https://...",
  "qrCode": "https://...",
  "consultUrl": "https://...",
  "recipient": {...},
  "items": [...],
  "totals": {...}
}
```

**Campos do Formulário**:
- `type`: select ("nfce" | "nfe")
- `recipient.cpfCnpj`: string (mask CPF/CNPJ)
- `recipient.name`: string (required)
- `recipient.email`: email (optional)
- `recipient.phone`: string (mask phone, optional)
- `items`: array (mínimo 1 item)
- `additionalInfo`: textarea (optional, max 5000 chars)

**Validações**:
- CPF/CNPJ válido
- Email válido (se preenchido)
- Pelo menos 1 item
- Valores numéricos positivos
- Total = soma dos itens - desconto

#### 2.2 Listar Notas Fiscais
```typescript
GET /business/fiscal/notes?page=1&limit=20&status=authorized&type=nfce&startDate=2026-01-01&endDate=2026-03-10

// Query Parameters
{
  page?: number,        // default: 1
  limit?: number,       // default: 20, max: 100
  status?: string,      // "authorized" | "rejected" | "cancelled" | "processing"
  type?: string,        // "nfce" | "nfe"
  startDate?: string,   // formato: YYYY-MM-DD
  endDate?: string      // formato: YYYY-MM-DD
}

// Response
{
  "data": [
    {
      "id": "uuid",
      "type": "nfce",
      "status": "authorized",
      "number": "000123",
      "series": "1",
      "accessKey": "35260212345678000190650010001230001234567890",
      "total": 75.00,
      "authorizedAt": "2026-02-28T10:35:00.000Z",
      "createdAt": "2026-02-28T10:35:00.000Z"
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```


#### 2.3 Consultar Nota Fiscal
```typescript
GET /business/fiscal/notes/:id

// Response
{
  "id": "uuid",
  "establishmentId": "uuid",
  "type": "nfce",
  "status": "authorized",
  "number": "000123",
  "series": "1",
  "accessKey": "35260212345678000190650010001230001234567890",
  "authorizationProtocol": "135260000123456",
  "authorizedAt": "2026-02-28T10:35:00.000Z",
  "danfeUrl": "https://...",
  "qrCode": "https://...",
  "consultUrl": "https://...",
  "recipient": {
    "cpfCnpj": "12345678901234",
    "name": "Cliente Exemplo",
    "email": "cliente@email.com",
    "phone": "(11) 98765-4321"
  },
  "items": [...],
  "totals": {...},
  "sale": {
    "id": "uuid",
    "saleNumber": "20260228-0001",
    "total": 75.00
  }
}
```

#### 2.4 Cancelar Nota Fiscal
```typescript
DELETE /business/fiscal/notes/:id
Content-Type: application/json

{
  "reason": "Motivo do cancelamento com no mínimo 15 caracteres"
}

// Response
{
  "id": "uuid",
  "status": "cancelled",
  "cancellationReason": "Motivo do cancelamento...",
  "cancelledAt": "2026-02-28T10:45:00.000Z",
  "message": "Nota fiscal cancelada com sucesso"
}
```

**Validações**:
- Motivo obrigatório (min 15 caracteres, max 255)
- NFC-e: até 30 minutos após autorização
- NF-e: até 24 horas após autorização


#### 2.5 Enviar/Reenviar Email
```typescript
POST /business/fiscal/notes/:id/send-email
POST /business/fiscal/notes/:id/resend-email

// Response
{
  "success": true,
  "message": "Email enviado com sucesso",
  "sentAt": "2026-02-28T10:50:00.000Z"
}
```

#### 2.6 Gerar DANFE (PDF)
```typescript
GET /business/fiscal/notes/:id/danfe

// Response: Binary (PDF file)
// Headers:
// Content-Type: application/pdf
// Content-Disposition: attachment; filename="danfe-000123.pdf"
```

### 3. Cartas de Correção

#### 3.1 Criar Carta de Correção
```typescript
POST /business/fiscal/notes/:id/correction
Content-Type: application/json

{
  "correctionType": 1,
  "correctionText": "Descrição da correção com no mínimo 15 caracteres"
}

// Response
{
  "id": "uuid",
  "fiscalNoteId": "uuid",
  "correctionType": 1,
  "correctionText": "Descrição da correção...",
  "status": "authorized",
  "protocol": "135260000123457",
  "createdAt": "2026-02-28T11:00:00.000Z"
}
```

**Validações**:
- Texto obrigatório (min 15 caracteres, max 1000)
- Até 30 dias após emissão da nota
- Máximo 20 correções por nota

#### 3.2 Listar Correções
```typescript
GET /business/fiscal/notes/:id/corrections

// Response
{
  "data": [
    {
      "id": "uuid",
      "correctionType": 1,
      "correctionText": "Descrição...",
      "status": "authorized",
      "protocol": "135260000123457",
      "createdAt": "2026-02-28T11:00:00.000Z"
    }
  ],
  "total": 2
}
```


### 4. Inutilização de Numeração

#### 4.1 Criar Inutilização
```typescript
POST /business/fiscal/disablement
Content-Type: application/json

{
  "startNumber": 1,
  "endNumber": 10,
  "justification": "Motivo da inutilização com 15-1000 caracteres"
}

// Response
{
  "id": "uuid",
  "establishmentId": "uuid",
  "startNumber": 1,
  "endNumber": 10,
  "justification": "Motivo...",
  "status": "authorized",
  "protocol": "135260000123458",
  "createdAt": "2026-02-28T11:10:00.000Z"
}
```

**Validações**:
- Números obrigatórios (1-999999999)
- startNumber <= endNumber
- Justificativa obrigatória (min 15, max 1000 chars)

#### 4.2 Listar Inutilizações
```typescript
GET /business/fiscal/disablement?page=1&limit=20

// Response
{
  "data": [
    {
      "id": "uuid",
      "startNumber": 1,
      "endNumber": 10,
      "justification": "Motivo...",
      "status": "authorized",
      "protocol": "135260000123458",
      "createdAt": "2026-02-28T11:10:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20
}
```


### 5. Relatórios

#### 5.1 Relatório de Notas
```typescript
GET /business/fiscal/reports/notes?startDate=2026-01-01&endDate=2026-03-10&status=authorized&format=json

// Query Parameters
{
  startDate: string,    // required, formato: YYYY-MM-DD
  endDate: string,      // required, formato: YYYY-MM-DD
  status?: string,      // "authorized" | "rejected" | "cancelled"
  type?: string,        // "nfce" | "nfe"
  format?: string       // "json" | "excel" | "csv", default: "json"
}

// Response (format=json)
{
  "summary": {
    "totalNotes": 150,
    "totalValue": 12500.00,
    "authorized": 145,
    "rejected": 3,
    "cancelled": 2
  },
  "notes": [
    {
      "id": "uuid",
      "number": "000123",
      "type": "nfce",
      "status": "authorized",
      "total": 75.00,
      "authorizedAt": "2026-02-28T10:35:00.000Z"
    }
  ]
}

// Response (format=excel ou csv)
// Binary file download
```

#### 5.2 Relatório Vendas vs Notas
```typescript
GET /business/fiscal/reports/sales-notes?startDate=2026-01-01&endDate=2026-03-10

// Response
{
  "summary": {
    "totalSales": 200,
    "salesWithNotes": 150,
    "salesWithoutNotes": 50,
    "complianceRate": 75.0
  },
  "salesWithoutNotes": [
    {
      "id": "uuid",
      "saleNumber": "20260228-0001",
      "total": 50.00,
      "createdAt": "2026-02-28T10:00:00.000Z"
    }
  ]
}
```


### 6. Contingência

#### 6.1 Listar Notas em Contingência
```typescript
GET /business/fiscal/contingency?page=1&limit=20

// Response
{
  "data": [
    {
      "id": "uuid",
      "documentType": "nfce",
      "series": "1",
      "number": "000124",
      "status": "pending",
      "contingencyReason": "SEFAZ indisponível",
      "transmissionAttempts": 2,
      "lastTransmissionAttempt": "2026-02-28T12:00:00.000Z",
      "createdAt": "2026-02-28T11:30:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20
}
```

#### 6.2 Transmitir Nota em Contingência
```typescript
POST /business/fiscal/contingency/:id/transmit

// Response
{
  "id": "uuid",
  "status": "transmitted",
  "transmittedAt": "2026-02-28T12:30:00.000Z",
  "fiscalNoteId": "uuid",
  "message": "Nota transmitida com sucesso"
}
```

### 7. Métricas

#### 7.1 Obter Métricas
```typescript
GET /business/fiscal/metrics

// Response
{
  "totalNotes": 1250,
  "successRate": 98.5,
  "rejectionRate": 1.2,
  "averageEmissionTime": 2.3,
  "statusBreakdown": {
    "authorized": 1200,
    "rejected": 15,
    "cancelled": 30,
    "pending": 5
  },
  "certificateExpiryDays": 45,
  "contingencyNotes": 3
}
```


### 8. CNPJ Lookup

#### 8.1 Consultar CNPJ
```typescript
GET /business/fiscal/cnpj/:cnpj

// Response
{
  "cnpj": "12.345.678/0001-90",
  "razaoSocial": "EMPRESA EXEMPLO LTDA",
  "nomeFantasia": "Mercado Exemplo",
  "situacao": "ATIVA",
  "endereco": {
    "logradouro": "Rua Exemplo",
    "numero": "123",
    "complemento": "Loja 1",
    "bairro": "Centro",
    "municipio": "São Paulo",
    "uf": "SP",
    "cep": "01234-567"
  },
  "telefone": "(11) 3456-7890",
  "email": "contato@exemplo.com.br",
  "atividadePrincipal": {
    "codigo": "4711-3/02",
    "descricao": "Comércio varejista de mercadorias em geral"
  }
}
```

#### 8.2 Validar CNPJ
```typescript
GET /business/fiscal/cnpj/:cnpj/validate

// Response
{
  "valid": true,
  "formatted": "12.345.678/0001-90"
}
```

---

## Modelos de Dados (TypeScript Interfaces)

### FiscalNote
```typescript
interface FiscalNote {
  id: string;
  establishmentId: string;
  saleId?: string;
  type: 'nfce' | 'nfe';
  status: 'processing' | 'authorized' | 'rejected' | 'cancelled';
  number: string;
  series: string;
  accessKey: string;
  authorizationProtocol?: string;
  authorizedAt?: Date;
  rejectionReason?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  danfeUrl?: string;
  qrCode?: string;
  consultUrl?: string;
  recipient: FiscalRecipient;
  items: FiscalItem[];
  totals: FiscalTotals;
  additionalInfo?: string;
  provider: string;
  environment: 'production' | 'homologation';
  emailSent: boolean;
  smsSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```


### FiscalRecipient
```typescript
interface FiscalRecipient {
  cpfCnpj: string;
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
  };
}
```

### FiscalItem
```typescript
interface FiscalItem {
  code: string;
  description: string;
  ncm: string;
  cfop: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxes: {
    icms: number;
    pis: number;
    cofins: number;
    ipi?: number;
  };
}
```

### FiscalTotals
```typescript
interface FiscalTotals {
  products: number;
  discount: number;
  freight?: number;
  total: number;
  taxes: {
    icms: number;
    pis: number;
    cofins: number;
    ipi?: number;
  };
}
```

### FiscalCertificate
```typescript
interface FiscalCertificate {
  id: string;
  establishmentId: string;
  type: 'A1' | 'A3';
  cnpj: string;
  holderName: string;
  expiresAt: Date;
  isActive: boolean;
  daysUntilExpiration: number;
  lastValidatedAt?: Date;
  createdAt: Date;
}
```


### FiscalCorrection
```typescript
interface FiscalCorrection {
  id: string;
  fiscalNoteId: string;
  correctionType: number;
  correctionText: string;
  status: 'processing' | 'authorized' | 'rejected';
  protocol?: string;
  rejectionReason?: string;
  createdAt: Date;
}
```

### FiscalDisablement
```typescript
interface FiscalDisablement {
  id: string;
  establishmentId: string;
  startNumber: number;
  endNumber: number;
  justification: string;
  status: 'processing' | 'authorized' | 'rejected';
  protocol?: string;
  rejectionReason?: string;
  createdAt: Date;
}
```

### FiscalContingencyNote
```typescript
interface FiscalContingencyNote {
  id: string;
  establishmentId: string;
  documentType: 'nfce' | 'nfe';
  series: string;
  number: string;
  status: 'pending' | 'transmitted' | 'failed';
  contingencyReason: string;
  transmissionAttempts: number;
  lastTransmissionAttempt?: Date;
  transmittedAt?: Date;
  failureReason?: string;
  fiscalNoteId?: string;
  createdAt: Date;
}
```

---

## Fluxos de Tela

### 1. Dashboard Fiscal
**Rota**: `/fiscal/dashboard`

**Componentes**:
- Card de métricas (total de notas, taxa de sucesso, etc)
- Gráfico de notas por período
- Alertas (certificado expirando, notas em contingência)
- Lista de últimas notas emitidas

**Dados necessários**:
- GET `/business/fiscal/metrics`
- GET `/business/fiscal/notes?limit=10`
- GET `/business/fiscal/certificate/validate`
- GET `/business/fiscal/contingency?limit=5`


### 2. Configuração de Certificado
**Rota**: `/fiscal/certificate`

**Componentes**:
- Formulário de upload de certificado
- Status do certificado atual
- Botão de validação
- Informações de expiração

**Fluxo**:
1. Usuário seleciona arquivo .pfx/.p12
2. Insere senha do certificado
3. Clica em "Enviar"
4. Sistema valida e salva
5. Exibe confirmação e dados do certificado

**Validações**:
- Arquivo obrigatório
- Senha obrigatória
- Formato válido
- Certificado não expirado

### 3. Emissão de Nota Fiscal
**Rota**: `/fiscal/notes/new`

**Componentes**:
- Seletor de tipo (NFC-e / NF-e)
- Formulário de destinatário
- Lista de itens (com botão adicionar/remover)
- Resumo de totais
- Campo de observações
- Botão "Emitir Nota"

**Fluxo**:
1. Seleciona tipo de nota
2. Preenche dados do destinatário (opcional para NFC-e)
3. Adiciona itens (pode buscar do estoque)
4. Sistema calcula totais automaticamente
5. Adiciona observações (opcional)
6. Clica em "Emitir"
7. Sistema processa e exibe resultado
8. Opção de enviar por email/SMS
9. Opção de baixar DANFE

**Validações**:
- Certificado válido
- Pelo menos 1 item
- CPF/CNPJ válido (se preenchido)
- Valores positivos
- NCM e CFOP obrigatórios


### 4. Lista de Notas Fiscais
**Rota**: `/fiscal/notes`

**Componentes**:
- Filtros (período, status, tipo)
- Tabela de notas
- Paginação
- Botões de ação (visualizar, cancelar, reenviar email, baixar DANFE)
- Exportar relatório (Excel/CSV)

**Colunas da Tabela**:
- Número
- Tipo (NFC-e/NF-e)
- Status (badge colorido)
- Cliente
- Valor
- Data de emissão
- Ações

**Ações por Status**:
- `authorized`: Visualizar, Cancelar (se dentro do prazo), Reenviar Email, Baixar DANFE, Carta de Correção
- `rejected`: Visualizar, Ver motivo da rejeição
- `cancelled`: Visualizar, Ver motivo do cancelamento
- `processing`: Visualizar, Aguardar processamento

### 5. Detalhes da Nota Fiscal
**Rota**: `/fiscal/notes/:id`

**Componentes**:
- Cabeçalho com status e número
- Dados do destinatário
- Lista de itens
- Totais
- Informações fiscais (chave de acesso, protocolo)
- QR Code (para NFC-e)
- Botões de ação
- Timeline de eventos (emissão, autorização, envio de email, etc)
- Lista de cartas de correção (se houver)

**Ações disponíveis**:
- Baixar DANFE (PDF)
- Baixar XML
- Enviar por email
- Cancelar (se dentro do prazo)
- Criar carta de correção
- Imprimir


### 6. Carta de Correção
**Rota**: `/fiscal/notes/:id/correction`

**Componentes**:
- Informações da nota original
- Formulário de correção
- Lista de correções anteriores

**Fluxo**:
1. Usuário acessa nota autorizada
2. Clica em "Criar Carta de Correção"
3. Preenche texto da correção
4. Clica em "Enviar"
5. Sistema processa e exibe resultado

**Validações**:
- Nota deve estar autorizada
- Até 30 dias após emissão
- Máximo 20 correções por nota
- Texto mínimo 15 caracteres

### 7. Inutilização de Numeração
**Rota**: `/fiscal/disablement`

**Componentes**:
- Formulário de inutilização
- Lista de inutilizações anteriores

**Fluxo**:
1. Usuário preenche número inicial e final
2. Insere justificativa
3. Clica em "Inutilizar"
4. Sistema processa e exibe resultado

**Validações**:
- Números válidos (1-999999999)
- Número inicial <= número final
- Justificativa mínimo 15 caracteres

### 8. Relatórios
**Rota**: `/fiscal/reports`

**Componentes**:
- Filtros de período
- Seletor de tipo de relatório
- Botões de exportação (Excel/CSV)
- Visualização de dados (tabelas/gráficos)

**Tipos de Relatório**:
- Notas emitidas por período
- Vendas vs Notas (compliance)
- Notas por status
- Notas por tipo


### 9. Contingência
**Rota**: `/fiscal/contingency`

**Componentes**:
- Lista de notas em contingência
- Status de cada nota
- Botão de transmissão manual
- Contador de tentativas

**Fluxo**:
1. Sistema detecta SEFAZ offline
2. Cria nota em contingência
3. Tenta transmitir automaticamente
4. Se falhar, exibe na lista
5. Usuário pode tentar transmitir manualmente

---

## Componentes Sugeridos

### 1. FiscalNoteCard
Exibe resumo de uma nota fiscal em formato de card.

**Props**:
```typescript
{
  note: FiscalNote;
  onView: (id: string) => void;
  onCancel?: (id: string) => void;
  onResendEmail?: (id: string) => void;
  onDownloadDanfe?: (id: string) => void;
}
```

### 2. FiscalStatusBadge
Badge colorido para exibir status da nota.

**Props**:
```typescript
{
  status: 'processing' | 'authorized' | 'rejected' | 'cancelled';
  size?: 'sm' | 'md' | 'lg';
}
```

**Cores**:
- `processing`: amarelo/laranja
- `authorized`: verde
- `rejected`: vermelho
- `cancelled`: cinza

### 3. FiscalItemList
Lista de itens da nota fiscal com totais.

**Props**:
```typescript
{
  items: FiscalItem[];
  totals: FiscalTotals;
  editable?: boolean;
  onAddItem?: (item: FiscalItem) => void;
  onRemoveItem?: (index: number) => void;
}
```


### 4. CertificateStatus
Exibe status do certificado digital.

**Props**:
```typescript
{
  certificate: FiscalCertificate | null;
  onUpload: () => void;
  onValidate: () => void;
}
```

**Estados**:
- Sem certificado: Botão de upload
- Certificado válido: Badge verde + dados
- Certificado expirando: Badge amarelo + alerta
- Certificado expirado: Badge vermelho + alerta

### 5. FiscalMetricsCard
Card de métricas do dashboard.

**Props**:
```typescript
{
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
}
```

### 6. QRCodeDisplay
Exibe QR Code da NFC-e.

**Props**:
```typescript
{
  qrCodeUrl: string;
  consultUrl: string;
  size?: number;
}
```

### 7. FiscalNoteFilters
Componente de filtros para lista de notas.

**Props**:
```typescript
{
  onFilter: (filters: FiscalNoteFilters) => void;
  initialFilters?: FiscalNoteFilters;
}

interface FiscalNoteFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  type?: string;
}
```


---

## Estados e Validações

### Estados de Nota Fiscal

```typescript
enum FiscalNoteStatus {
  PROCESSING = 'processing',    // Aguardando processamento
  AUTHORIZED = 'authorized',    // Autorizada pela SEFAZ
  REJECTED = 'rejected',        // Rejeitada pela SEFAZ
  CANCELLED = 'cancelled'       // Cancelada
}
```

**Transições permitidas**:
- `processing` → `authorized` (sucesso)
- `processing` → `rejected` (erro)
- `authorized` → `cancelled` (dentro do prazo)

### Validações de Formulários

#### Certificado Digital
```typescript
const certificateValidation = {
  file: {
    required: true,
    accept: ['.pfx', '.p12'],
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  password: {
    required: true,
    minLength: 4,
    maxLength: 50
  }
};
```

#### Emissão de Nota
```typescript
const noteValidation = {
  type: {
    required: true,
    enum: ['nfce', 'nfe']
  },
  recipient: {
    cpfCnpj: {
      required: false, // opcional para NFC-e
      validate: validateCpfCnpj
    },
    name: {
      required: false,
      maxLength: 255
    },
    email: {
      required: false,
      validate: validateEmail
    }
  },
  items: {
    required: true,
    minLength: 1,
    validate: (items) => items.every(item => 
      item.quantity > 0 && 
      item.unitPrice > 0 &&
      item.ncm.length === 8 &&
      item.cfop.length === 4
    )
  },
  additionalInfo: {
    maxLength: 5000
  }
};
```


#### Cancelamento
```typescript
const cancellationValidation = {
  reason: {
    required: true,
    minLength: 15,
    maxLength: 255
  },
  timeLimit: {
    nfce: 30 * 60 * 1000, // 30 minutos em ms
    nfe: 24 * 60 * 60 * 1000 // 24 horas em ms
  }
};
```

#### Carta de Correção
```typescript
const correctionValidation = {
  correctionText: {
    required: true,
    minLength: 15,
    maxLength: 1000
  },
  timeLimit: 30 * 24 * 60 * 60 * 1000, // 30 dias em ms
  maxCorrections: 20
};
```

#### Inutilização
```typescript
const disablementValidation = {
  startNumber: {
    required: true,
    min: 1,
    max: 999999999
  },
  endNumber: {
    required: true,
    min: 1,
    max: 999999999,
    validate: (value, startNumber) => value >= startNumber
  },
  justification: {
    required: true,
    minLength: 15,
    maxLength: 1000
  }
};
```

---

## Tratamento de Erros

### Códigos de Erro Comuns

```typescript
const fiscalErrors = {
  // Certificado
  'CERTIFICATE_NOT_FOUND': {
    message: 'Certificado digital não encontrado',
    action: 'Faça upload do certificado digital'
  },
  'CERTIFICATE_EXPIRED': {
    message: 'Certificado digital expirado',
    action: 'Renove seu certificado digital'
  },
  'CERTIFICATE_INVALID_PASSWORD': {
    message: 'Senha do certificado incorreta',
    action: 'Verifique a senha e tente novamente'
  },
  
  // Nota Fiscal
  'INVALID_CPF_CNPJ': {
    message: 'CPF/CNPJ inválido',
    action: 'Verifique o CPF/CNPJ informado'
  },
  'INVALID_NCM': {
    message: 'NCM inválido',
    action: 'Verifique o código NCM do produto'
  },
  'SEFAZ_OFFLINE': {
    message: 'SEFAZ indisponível',
    action: 'A nota será emitida em contingência'
  },
  'CANCELLATION_TIMEOUT': {
    message: 'Prazo de cancelamento expirado',
    action: 'NFC-e: 30 min / NF-e: 24h'
  },
  
  // Correção
  'MAX_CORRECTIONS_REACHED': {
    message: 'Limite de correções atingido',
    action: 'Máximo de 20 correções por nota'
  },
  'CORRECTION_TIMEOUT': {
    message: 'Prazo de correção expirado',
    action: 'Correções permitidas até 30 dias'
  }
};
```


### Exemplo de Tratamento de Erro

```typescript
async function handleFiscalError(error: any) {
  const errorCode = error.response?.data?.code;
  const errorInfo = fiscalErrors[errorCode];
  
  if (errorInfo) {
    toast.error(errorInfo.message, {
      description: errorInfo.action,
      duration: 5000
    });
  } else {
    toast.error('Erro ao processar operação fiscal', {
      description: error.message || 'Tente novamente',
      duration: 5000
    });
  }
  
  // Log para debug
  console.error('Fiscal Error:', {
    code: errorCode,
    message: error.message,
    response: error.response?.data
  });
}
```

### Exemplo de Loading States

```typescript
const [loadingStates, setLoadingStates] = useState({
  emitting: false,
  cancelling: false,
  sendingEmail: false,
  downloadingDanfe: false
});

// Uso
async function emitNote(data: FiscalNoteData) {
  setLoadingStates(prev => ({ ...prev, emitting: true }));
  
  try {
    const response = await api.post('/business/fiscal/notes', data);
    toast.success('Nota fiscal emitida com sucesso!');
    return response.data;
  } catch (error) {
    handleFiscalError(error);
  } finally {
    setLoadingStates(prev => ({ ...prev, emitting: false }));
  }
}
```

---

## Utilitários Recomendados

### 1. Formatação de CPF/CNPJ
```typescript
function formatCpfCnpj(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 11) {
    // CPF: 000.000.000-00
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else {
    // CNPJ: 00.000.000/0000-00
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}
```


### 2. Validação de CPF/CNPJ
```typescript
function validateCpfCnpj(value: string): boolean {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    return validateCpf(numbers);
  } else if (numbers.length === 14) {
    return validateCnpj(numbers);
  }
  
  return false;
}

function validateCpf(cpf: string): boolean {
  // Implementação da validação de CPF
  // ... (algoritmo de validação)
  return true; // simplificado
}

function validateCnpj(cnpj: string): boolean {
  // Implementação da validação de CNPJ
  // ... (algoritmo de validação)
  return true; // simplificado
}
```

### 3. Formatação de Valores
```typescript
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}
```

### 4. Cálculo de Totais
```typescript
function calculateTotals(items: FiscalItem[], discount: number = 0): FiscalTotals {
  const products = items.reduce((sum, item) => sum + item.total, 0);
  const icms = items.reduce((sum, item) => sum + item.taxes.icms, 0);
  const pis = items.reduce((sum, item) => sum + item.taxes.pis, 0);
  const cofins = items.reduce((sum, item) => sum + item.taxes.cofins, 0);
  
  return {
    products,
    discount,
    total: products - discount,
    taxes: { icms, pis, cofins }
  };
}
```


### 5. Verificação de Prazo de Cancelamento
```typescript
function canCancelNote(note: FiscalNote): { can: boolean; reason?: string } {
  if (note.status !== 'authorized') {
    return { can: false, reason: 'Nota não está autorizada' };
  }
  
  const authorizedAt = new Date(note.authorizedAt!);
  const now = new Date();
  const diffMs = now.getTime() - authorizedAt.getTime();
  
  const timeLimit = note.type === 'nfce' 
    ? 30 * 60 * 1000  // 30 minutos
    : 24 * 60 * 60 * 1000; // 24 horas
  
  if (diffMs > timeLimit) {
    const limitText = note.type === 'nfce' ? '30 minutos' : '24 horas';
    return { 
      can: false, 
      reason: `Prazo de cancelamento expirado (${limitText})` 
    };
  }
  
  return { can: true };
}
```

### 6. Download de Arquivo
```typescript
async function downloadFile(url: string, filename: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Erro ao baixar arquivo');
  }
}
```

---

## Exemplo de Serviço API (React/TypeScript)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fiscalService = {
  // Certificados
  uploadCertificate: (data: { certificateBase64: string; password: string }) =>
    api.post('/business/fiscal/certificate/upload', data),
  
  getCertificate: () =>
    api.get('/business/fiscal/certificate'),
  
  validateCertificate: () =>
    api.get('/business/fiscal/certificate/validate'),
  
  // Notas Fiscais
  emitNote: (data: FiscalNoteData) =>
    api.post('/business/fiscal/notes', data),
  
  getNotes: (params?: FiscalNoteFilters) =>
    api.get('/business/fiscal/notes', { params }),
  
  getNote: (id: string) =>
    api.get(`/business/fiscal/notes/${id}`),
  
  cancelNote: (id: string, reason: string) =>
    api.delete(`/business/fiscal/notes/${id}`, { data: { reason } }),
  
  sendEmail: (id: string) =>
    api.post(`/business/fiscal/notes/${id}/send-email`),
  
  resendEmail: (id: string) =>
    api.post(`/business/fiscal/notes/${id}/resend-email`),
  
  downloadDanfe: (id: string) =>
    api.get(`/business/fiscal/notes/${id}/danfe`, { responseType: 'blob' }),
  
  // Correções
  createCorrection: (noteId: string, data: CorrectionData) =>
    api.post(`/business/fiscal/notes/${noteId}/correction`, data),
  
  getCorrections: (noteId: string) =>
    api.get(`/business/fiscal/notes/${noteId}/corrections`),
  
  // Inutilização
  createDisablement: (data: DisablementData) =>
    api.post('/business/fiscal/disablement', data),
  
  getDisablements: (params?: PaginationParams) =>
    api.get('/business/fiscal/disablement', { params }),
  
  // Relatórios
  getNotesReport: (params: ReportParams) =>
    api.get('/business/fiscal/reports/notes', { params }),
  
  getSalesNotesReport: (params: { startDate: string; endDate: string }) =>
    api.get('/business/fiscal/reports/sales-notes', { params }),
  
  // Contingência
  getContingencyNotes: (params?: PaginationParams) =>
    api.get('/business/fiscal/contingency', { params }),
  
  transmitContingencyNote: (id: string) =>
    api.post(`/business/fiscal/contingency/${id}/transmit`),
  
  // Métricas
  getMetrics: () =>
    api.get('/business/fiscal/metrics'),
  
  // CNPJ
  lookupCnpj: (cnpj: string) =>
    api.get(`/business/fiscal/cnpj/${cnpj}`),
  
  validateCnpj: (cnpj: string) =>
    api.get(`/business/fiscal/cnpj/${cnpj}/validate`)
};
```

---

## Checklist de Implementação

### Fase 1: Configuração Base
- [ ] Criar rotas no frontend
- [ ] Configurar serviço de API
- [ ] Implementar autenticação
- [ ] Criar interfaces TypeScript

### Fase 2: Certificado Digital
- [ ] Tela de upload de certificado
- [ ] Validação de certificado
- [ ] Exibição de status
- [ ] Alertas de expiração

### Fase 3: Emissão de Notas
- [ ] Formulário de emissão
- [ ] Validações de campos
- [ ] Cálculo automático de totais
- [ ] Integração com estoque (buscar produtos)
- [ ] Feedback de sucesso/erro

### Fase 4: Gestão de Notas
- [ ] Lista de notas com filtros
- [ ] Detalhes da nota
- [ ] Cancelamento
- [ ] Reenvio de email
- [ ] Download de DANFE
- [ ] Exibição de QR Code

### Fase 5: Funcionalidades Avançadas
- [ ] Carta de correção
- [ ] Inutilização de numeração
- [ ] Relatórios
- [ ] Exportação (Excel/CSV)
- [ ] Contingência

### Fase 6: Dashboard e Métricas
- [ ] Dashboard fiscal
- [ ] Cards de métricas
- [ ] Gráficos
- [ ] Alertas

### Fase 7: Testes e Refinamentos
- [ ] Testes de integração
- [ ] Tratamento de erros
- [ ] Loading states
- [ ] Responsividade
- [ ] Acessibilidade

---

**Última atualização**: Março 2026
**Versão**: 1.0.0
