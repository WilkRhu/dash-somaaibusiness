# 🚀 Quick Start - Sistema Fiscal

## O que foi criado (Fase 1)

### ✅ Infraestrutura Pronta

```
lib/
├── types/fiscal.ts              ✅ Tipos TypeScript
├── api/fiscal.ts                ✅ Serviço de API
├── hooks/
│   ├── use-fiscal-notes.ts      ✅ Hook para notas
│   ├── use-fiscal-certificate.ts ✅ Hook para certificado
│   └── use-fiscal-metrics.ts    ✅ Hook para métricas
└── utils/
    ├── fiscal-formatters.ts     ✅ Formatação
    └── fiscal-validators.ts     ✅ Validação
```

---

## Como Usar

### 1. Importar Tipos

```typescript
import {
  FiscalNote,
  FiscalNoteType,
  FiscalNoteStatus,
  FiscalCertificate,
} from '@/lib/types/fiscal';
```

### 2. Usar Hooks

```typescript
'use client';

import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';
import { useFiscalCertificate } from '@/lib/hooks/use-fiscal-certificate';

export default function MyComponent() {
  // Gerenciar notas
  const { notes, emitNote, cancelNote, isLoading } = useFiscalNotes();

  // Gerenciar certificado
  const { certificate, uploadCertificate, validateCertificate } = useFiscalCertificate();

  // Usar...
}
```

### 3. Usar Formatadores

```typescript
import {
  formatCpfCnpj,
  formatCurrency,
  formatDateTime,
  daysUntilExpiry,
  isCertificateExpired,
} from '@/lib/utils/fiscal-formatters';

// Formatar CPF/CNPJ
const formatted = formatCpfCnpj('12345678901234'); // 12.345.678/0001-34

// Formatar moeda
const price = formatCurrency(1234.56); // R$ 1.234,56

// Formatar data
const date = formatDateTime('2026-03-10T10:30:00'); // 10/03/2026 10:30

// Verificar expiração
const days = daysUntilExpiry('2027-03-10'); // 365
const expired = isCertificateExpired('2025-03-10'); // true
```

### 4. Usar Validadores

```typescript
import {
  validateCPFCNPJ,
  validateEmail,
  validateNCM,
  validateCFOP,
  canCancelNote,
  canMakeCorrection,
} from '@/lib/utils/fiscal-validators';

// Validar CPF/CNPJ
if (validateCPFCNPJ('12.345.678/0001-34')) {
  // Válido!
}

// Validar email
if (validateEmail('user@example.com')) {
  // Válido!
}

// Verificar se pode cancelar
if (canCancelNote(note.authorizedAt, 'nfce')) {
  // Pode cancelar (dentro de 30 minutos)
}

// Verificar se pode fazer correção
if (canMakeCorrection(note.createdAt)) {
  // Pode fazer correção (dentro de 30 dias)
}
```

### 5. Usar API Diretamente

```typescript
import { fiscalApi } from '@/lib/api/fiscal';

// Emitir nota
const note = await fiscalApi.emitNote({
  type: 'nfce',
  recipient: { cpfCnpj: '12345678901234', name: 'Cliente' },
  items: [...],
  totals: {...},
  series: '1',
});

// Cancelar nota
await fiscalApi.cancelNote(noteId, 'Motivo do cancelamento');

// Baixar DANFE
const blob = await fiscalApi.downloadDanfe(noteId);

// Enviar por email
await fiscalApi.sendEmail(noteId);

// Obter métricas
const metrics = await fiscalApi.getMetrics();
```

---

## Exemplo Completo: Emitir Nota

```typescript
'use client';

import { useState } from 'react';
import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';
import { useFiscalCertificate } from '@/lib/hooks/use-fiscal-certificate';
import { validateCPFCNPJ, validateNCM, validateCFOP } from '@/lib/utils/fiscal-validators';
import { formatCpfCnpj, formatCurrency } from '@/lib/utils/fiscal-formatters';
import { showToast } from '@/components/ui/toast';

export default function EmitNotePage() {
  const { emitNote, isLoading } = useFiscalNotes();
  const { certificate } = useFiscalCertificate();
  
  const [formData, setFormData] = useState({
    type: 'nfce',
    cpfCnpj: '',
    name: '',
    items: [],
  });

  const handleEmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar certificado
    if (!certificate) {
      showToast('Certificado não configurado', 'error');
      return;
    }

    // Validar CPF/CNPJ
    if (!validateCPFCNPJ(formData.cpfCnpj)) {
      showToast('CPF/CNPJ inválido', 'error');
      return;
    }

    // Validar itens
    if (formData.items.length === 0) {
      showToast('Adicione pelo menos um item', 'error');
      return;
    }

    // Validar NCM e CFOP de cada item
    for (const item of formData.items) {
      if (!validateNCM(item.ncm)) {
        showToast(`NCM inválido: ${item.ncm}`, 'error');
        return;
      }
      if (!validateCFOP(item.cfop)) {
        showToast(`CFOP inválido: ${item.cfop}`, 'error');
        return;
      }
    }

    try {
      // Calcular totais
      const total = formData.items.reduce((sum, item) => sum + item.total, 0);

      // Emitir nota
      const note = await emitNote({
        type: formData.type as any,
        recipient: {
          cpfCnpj: formData.cpfCnpj,
          name: formData.name,
        },
        items: formData.items,
        totals: {
          products: total,
          discount: 0,
          total,
          taxes: { icms: 0, pis: 0, cofins: 0 },
        },
        series: '1',
      });

      showToast('Nota fiscal emitida com sucesso!', 'success');
      console.log('Nota emitida:', note);
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Emitir Nota Fiscal</h1>

      <form onSubmit={handleEmit} className="space-y-4">
        {/* Tipo de nota */}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Nota</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="nfce">NFC-e</option>
            <option value="nfe">NF-e</option>
          </select>
        </div>

        {/* CPF/CNPJ */}
        <div>
          <label className="block text-sm font-medium mb-1">CPF/CNPJ</label>
          <input
            type="text"
            value={formData.cpfCnpj}
            onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
            placeholder="12.345.678/0001-34"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium mb-1">Nome do Cliente</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nome completo"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Emitindo...' : 'Emitir Nota'}
        </button>
      </form>
    </div>
  );
}
```

---

## Próximos Passos

### 1. Criar Página de Certificado (Fase 2)
```bash
mkdir -p app/(dashboard)/fiscal/certificate
touch app/(dashboard)/fiscal/certificate/page.tsx
```

### 2. Criar Página de Emissão (Fase 3)
```bash
mkdir -p app/(dashboard)/fiscal/notes/new
touch app/(dashboard)/fiscal/notes/new/page.tsx
```

### 3. Criar Componentes
```bash
mkdir -p components/fiscal
touch components/fiscal/certificate-status.tsx
touch components/fiscal/fiscal-note-card.tsx
```

---

## Checklist de Uso

- [ ] Importar tipos necessários
- [ ] Usar hooks para gerenciar estado
- [ ] Validar dados com validadores
- [ ] Formatar dados com formatadores
- [ ] Tratar erros com try/catch
- [ ] Mostrar feedback ao usuário (toast)
- [ ] Testar com dados reais

---

## Troubleshooting

### Erro: "Certificado não encontrado"
- Fazer upload do certificado na página de configuração
- Verificar se o arquivo é .pfx ou .p12
- Verificar se a senha está correta

### Erro: "CPF/CNPJ inválido"
- Usar `validateCPFCNPJ()` para validar antes de enviar
- Remover formatação com `unformatCpfCnpj()`

### Erro: "Nota não autorizada"
- Verificar se o certificado está válido
- Verificar se a SEFAZ está online
- Verificar os dados da nota (NCM, CFOP, etc)

---

## Documentação Completa

- 📖 Guia de Integração: `docs/FRONTEND_FISCAL_INTEGRATION_GUIDE.md`
- 📋 Plano de Implementação: `docs/FISCAL_IMPLEMENTATION_PLAN.md`
- 📊 Status de Implementação: `docs/FISCAL_IMPLEMENTATION_STATUS.md`

