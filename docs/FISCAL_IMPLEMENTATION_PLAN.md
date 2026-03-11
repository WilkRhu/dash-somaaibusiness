# 📋 Plano de Implementação - Sistema Fiscal

## ✅ Fase 1: Configuração Base (CONCLUÍDA)

### O que foi criado:

#### 1. **Tipos TypeScript** (`lib/types/fiscal.ts`)
- ✅ `FiscalNoteStatus` - Estados da nota
- ✅ `FiscalNoteType` - Tipos de nota (NFC-e, NF-e)
- ✅ `FiscalRecipient` - Dados do destinatário
- ✅ `FiscalItem` - Item da nota
- ✅ `FiscalTotals` - Totais da nota
- ✅ `FiscalNote` - Nota fiscal completa
- ✅ `FiscalCertificate` - Certificado digital
- ✅ `FiscalCorrection` - Carta de correção
- ✅ `FiscalDisablement` - Inutilização
- ✅ `FiscalContingencyNote` - Nota em contingência
- ✅ `FiscalMetrics` - Métricas
- ✅ Interfaces de filtros e dados

#### 2. **Utilitários de Formatação** (`lib/utils/fiscal-formatters.ts`)
- ✅ `formatCpfCnpj()` - Formata CPF/CNPJ
- ✅ `formatCurrency()` - Formata valores em Real
- ✅ `formatDateTime()` - Formata data e hora
- ✅ `formatPhone()` - Formata telefone
- ✅ `formatZipCode()` - Formata CEP
- ✅ `formatAccessKey()` - Formata chave de acesso
- ✅ `formatNCM()` - Formata NCM
- ✅ `formatCFOP()` - Formata CFOP
- ✅ `daysUntilExpiry()` - Calcula dias até expiração
- ✅ `isCertificateExpired()` - Verifica se expirado
- ✅ `isCertificateExpiringSoon()` - Verifica se próximo de expirar
- ✅ Formatadores de status e tipos

#### 3. **Utilitários de Validação** (`lib/utils/fiscal-validators.ts`)
- ✅ `validateCPF()` - Valida CPF
- ✅ `validateCNPJ()` - Valida CNPJ
- ✅ `validateCPFCNPJ()` - Valida CPF ou CNPJ
- ✅ `validateEmail()` - Valida email
- ✅ `validateNCM()` - Valida NCM
- ✅ `validateCFOP()` - Valida CFOP
- ✅ `validateZipCode()` - Valida CEP
- ✅ `validatePhone()` - Valida telefone
- ✅ `validateAccessKey()` - Valida chave de acesso
- ✅ `validateCancellationReason()` - Valida motivo de cancelamento
- ✅ `validateCorrectionText()` - Valida texto de correção
- ✅ `canCancelNote()` - Verifica se pode cancelar
- ✅ `canMakeCorrection()` - Verifica se pode fazer correção
- ✅ `validateCertificateFile()` - Valida arquivo de certificado
- ✅ `validateNoteEmissionData()` - Valida dados de emissão

#### 4. **Serviço de API** (`lib/api/fiscal.ts`)
- ✅ `uploadCertificate()` - Upload de certificado
- ✅ `getCertificate()` - Consultar certificado
- ✅ `validateCertificate()` - Validar certificado
- ✅ `emitNote()` - Emitir nota fiscal
- ✅ `getNotes()` - Listar notas
- ✅ `getNote()` - Consultar nota
- ✅ `cancelNote()` - Cancelar nota
- ✅ `sendEmail()` - Enviar por email
- ✅ `resendEmail()` - Reenviar por email
- ✅ `downloadDanfe()` - Baixar DANFE
- ✅ `createCorrection()` - Criar correção
- ✅ `getCorrections()` - Listar correções
- ✅ `createDisablement()` - Criar inutilização
- ✅ `getDisablements()` - Listar inutilizações
- ✅ `getNotesReport()` - Relatório de notas
- ✅ `getSalesNotesReport()` - Relatório vendas vs notas
- ✅ `getContingencyNotes()` - Listar contingência
- ✅ `transmitContingencyNote()` - Transmitir contingência
- ✅ `getMetrics()` - Obter métricas
- ✅ `lookupCnpj()` - Consultar CNPJ
- ✅ `validateCnpj()` - Validar CNPJ

#### 5. **Hooks Customizados**
- ✅ `useFiscalNotes()` (`lib/hooks/use-fiscal-notes.ts`)
  - Gerenciar notas fiscais
  - Emitir, cancelar, consultar
  - Enviar email, baixar DANFE
  - Criar e listar correções
  
- ✅ `useFiscalCertificate()` (`lib/hooks/use-fiscal-certificate.ts`)
  - Gerenciar certificado
  - Upload, validação
  - Auto-fetch ao montar
  
- ✅ `useFiscalMetrics()` (`lib/hooks/use-fiscal-metrics.ts`)
  - Obter métricas fiscais
  - Auto-fetch ao montar

---

## 🔄 Próximas Fases

### Fase 2: Certificado Digital (2-3 dias)

**Objetivo**: Implementar interface de upload e gerenciamento de certificado

**Arquivos a criar**:
```
app/(dashboard)/fiscal/
└── certificate/
    └── page.tsx

components/fiscal/
├── certificate-status.tsx
└── modals/
    └── certificate-upload-modal.tsx
```

**Funcionalidades**:
- [ ] Página de certificado
- [ ] Upload de arquivo .pfx/.p12
- [ ] Validação de senha
- [ ] Exibição de status
- [ ] Alertas de expiração
- [ ] Botão de validação

**Exemplo de uso**:
```typescript
import { useFiscalCertificate } from '@/lib/hooks/use-fiscal-certificate';

export default function CertificatePage() {
  const { certificate, uploadCertificate, validateCertificate } = useFiscalCertificate();
  
  // Implementar interface...
}
```

---

### Fase 3: Emissão de Notas (4-5 dias)

**Objetivo**: Implementar formulário de emissão de notas fiscais

**Arquivos a criar**:
```
app/(dashboard)/fiscal/
├── notes/
│   ├── page.tsx
│   ├── new/
│   │   └── page.tsx
│   └── [id]/
│       └── page.tsx

components/fiscal/
├── fiscal-note-card.tsx
├── fiscal-status-badge.tsx
├── fiscal-item-list.tsx
├── fiscal-note-filters.tsx
└── forms/
    └── emit-note-form.tsx
```

**Funcionalidades**:
- [ ] Formulário de emissão
- [ ] Seletor de tipo (NFC-e/NF-e)
- [ ] Busca de cliente
- [ ] Lista de itens
- [ ] Cálculo automático de totais
- [ ] Validações em tempo real
- [ ] Envio para SEFAZ

**Exemplo de uso**:
```typescript
import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';

export default function EmitNotePage() {
  const { emitNote, isLoading } = useFiscalNotes();
  
  const handleEmit = async (data: FiscalNoteData) => {
    try {
      const note = await emitNote(data);
      // Sucesso!
    } catch (error) {
      // Erro
    }
  };
}
```

---

### Fase 4: Gestão de Notas (3-4 dias)

**Objetivo**: Implementar listagem e detalhes de notas

**Arquivos a criar**:
```
app/(dashboard)/fiscal/
└── notes/
    ├── page.tsx
    └── [id]/
        ├── page.tsx
        └── correction/
            └── page.tsx

components/fiscal/
├── qr-code-display.tsx
└── forms/
    ├── cancel-note-form.tsx
    └── correction-form.tsx
```

**Funcionalidades**:
- [ ] Lista de notas com filtros
- [ ] Paginação
- [ ] Detalhes da nota
- [ ] Cancelamento
- [ ] Reenvio de email
- [ ] Download de DANFE
- [ ] Exibição de QR Code
- [ ] Carta de correção

---

### Fase 5: Funcionalidades Avançadas (3-4 dias)

**Objetivo**: Implementar funcionalidades complementares

**Arquivos a criar**:
```
app/(dashboard)/fiscal/
├── disablement/
│   └── page.tsx
├── reports/
│   └── page.tsx
└── contingency/
    └── page.tsx

components/fiscal/
├── fiscal-metrics-card.tsx
└── forms/
    └── disablement-form.tsx
```

**Funcionalidades**:
- [ ] Inutilização de numeração
- [ ] Relatórios fiscais
- [ ] Exportação (Excel/CSV)
- [ ] Gestão de contingência
- [ ] Transmissão manual

---

### Fase 6: Dashboard (2-3 dias)

**Objetivo**: Implementar dashboard com métricas

**Arquivos a criar**:
```
app/(dashboard)/fiscal/
└── dashboard/
    └── page.tsx
```

**Funcionalidades**:
- [ ] Cards de métricas
- [ ] Gráficos de desempenho
- [ ] Alertas
- [ ] Status do certificado
- [ ] Últimas notas emitidas

---

### Fase 7: Integração com Vendas (2-3 dias)

**Objetivo**: Conectar POS com sistema fiscal

**Modificações**:
```
app/(dashboard)/sales/
├── page.tsx (adicionar botão de emissão)
└── pos/
    └── page.tsx (integração automática)
```

**Funcionalidades**:
- [ ] Botão "Emitir Nota Fiscal" na lista de vendas
- [ ] Emissão automática após venda
- [ ] Armazenamento de referência de nota
- [ ] Exibição de status fiscal
- [ ] Integração de dados

---

### Fase 8: Testes e Refinamentos (2-3 dias)

**Objetivo**: Garantir qualidade e usabilidade

**Atividades**:
- [ ] Testes de integração
- [ ] Tratamento de erros
- [ ] Loading states
- [ ] Responsividade
- [ ] Acessibilidade
- [ ] Performance

---

## 🚀 Como Começar a Fase 2

### 1. Criar a página de certificado

```bash
# Criar estrutura de pastas
mkdir -p app/(dashboard)/fiscal/certificate
```

### 2. Criar componente de upload

```typescript
// components/fiscal/modals/certificate-upload-modal.tsx
'use client';

import { useState } from 'react';
import { useFiscalCertificate } from '@/lib/hooks/use-fiscal-certificate';
import { validateCertificateFile, validateCertificatePassword } from '@/lib/utils/fiscal-validators';
import { showToast } from '@/components/ui/toast';

export function CertificateUploadModal({ isOpen, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const { uploadCertificate, isLoading } = useFiscalCertificate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      showToast('Selecione um arquivo', 'error');
      return;
    }

    if (!validateCertificateFile(file)) {
      showToast('Arquivo inválido (use .pfx ou .p12, máx 5MB)', 'error');
      return;
    }

    if (!validateCertificatePassword(password)) {
      showToast('Senha inválida (mínimo 4 caracteres)', 'error');
      return;
    }

    try {
      await uploadCertificate(file, password);
      showToast('Certificado enviado com sucesso!', 'success');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  // Implementar JSX...
}
```

### 3. Criar página de certificado

```typescript
// app/(dashboard)/fiscal/certificate/page.tsx
'use client';

import { useFiscalCertificate } from '@/lib/hooks/use-fiscal-certificate';
import { CertificateUploadModal } from '@/components/fiscal/modals/certificate-upload-modal';
import { CertificateStatus } from '@/components/fiscal/certificate-status';

export default function CertificatePage() {
  const { certificate, validateCertificate } = useFiscalCertificate();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Certificado Digital</h1>
      
      <CertificateStatus 
        certificate={certificate}
        onUpload={() => setIsUploadOpen(true)}
        onValidate={validateCertificate}
      />

      <CertificateUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
```

---

## 📊 Progresso Geral

```
Fase 1: Configuração Base        ████████████████████ 100% ✅
Fase 2: Certificado Digital      ░░░░░░░░░░░░░░░░░░░░   0%
Fase 3: Emissão de Notas         ░░░░░░░░░░░░░░░░░░░░   0%
Fase 4: Gestão de Notas          ░░░░░░░░░░░░░░░░░░░░   0%
Fase 5: Funcionalidades Avançadas░░░░░░░░░░░░░░░░░░░░   0%
Fase 6: Dashboard                ░░░░░░░░░░░░░░░░░░░░   0%
Fase 7: Integração com Vendas    ░░░░░░░░░░░░░░░░░░░░   0%
Fase 8: Testes e Refinamentos    ░░░░░░░░░░░░░░░░░░░░   0%

TOTAL: 12.5% (1 de 8 fases)
```

---

## 📝 Notas Importantes

1. **Reutilizar componentes existentes**: Use componentes de UI já criados (buttons, modals, etc)
2. **Seguir padrão de código**: Manter consistência com o resto do projeto
3. **Testar incrementalmente**: Testar cada fase antes de passar para a próxima
4. **Documentar mudanças**: Atualizar este documento conforme avança
5. **Comunicar com backend**: Garantir que as rotas de API estão prontas

---

## 🔗 Referências

- Guia de Integração: `docs/FRONTEND_FISCAL_INTEGRATION_GUIDE.md`
- Status de Implementação: `docs/FISCAL_IMPLEMENTATION_STATUS.md`
- Tipos criados: `lib/types/fiscal.ts`
- Utilitários: `lib/utils/fiscal-*.ts`
- API: `lib/api/fiscal.ts`
- Hooks: `lib/hooks/use-fiscal-*.ts`

