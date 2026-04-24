# MockSefazProvider Frontend Guide

Este guia mostra como as aplicações frontend podem aproveitar o `MockSefazProvider` para testar o cadastro, validação e emissão de notas fiscais sem depender de certificado A1 real nem da SEFAZ oficial.

## 1. Por que usar o mock?

- O `MockSefazProvider` simula todos os principais fluxos da SEFAZ (emissão, cancelamento, carta de correção, inutilização, validação de certificado) e permite validar a integração fiscal end-to-end em ambiente local ou de teste.
- Evita esperar por homologação ou certificado A1 durante o desenvolvimento inicial.

## 2. Pré-requisitos

1. Backend rodando (`npm run start:dev` ou similar).
2. Token JWT de um usuário que pertença a um estabelecimento cadastrado.
3. Axios/fetch configurado com `Authorization: Bearer <token>`.
4. Ambiente sabendo que os endpoints estão sob `/business/fiscal/mock-sefaz`.

## 3. Pontos de entrada (endpoints mais úteis)

| Método | Endpoint | Uso | Input mínimo |
| --- | --- | --- | --- |
| `POST` | `/business/fiscal/mock-sefaz/issue-note` | Emite nota fictícia (mock) | `series`, `totalValue`, `recipientCnpj`, `recipientName` |
| `POST` | `/business/fiscal/mock-sefaz/cancel-note/{accessKey}` | Cancela nota simulada | `reason` |
| `POST` | `/business/fiscal/mock-sefaz/send-correction/{accessKey}` | Carta de correção | `correction` |
| `POST` | `/business/fiscal/mock-sefaz/disable-numbering` | Inutiliza numeração | `series`, `numberStart`, `numberEnd`, `reason` |
| `POST` | `/business/fiscal/mock-sefaz/validate-certificate` | Valida certificado de teste | `certificateData` (base64), `password` |
| `GET` | `/business/fiscal/mock-sefaz/test-data` | Dados fictícios de CNPJ/produtos para preencher formulários | nenhum |

## 4. Exemplo de uso com Axios

```typescript
import api from '../services/api';

const mockFiscal = {
  async issueNote(payload: { series: string; totalValue: number; recipientCnpj: string; recipientName: string }) {
    const response = await api.post('/business/fiscal/mock-sefaz/issue-note', payload);
    return response.data;
  },

  async validateCertificate(certificateBase64: string, password: string) {
    const response = await api.post('/business/fiscal/mock-sefaz/validate-certificate', {
      certificateData: certificateBase64,
      password,
    });
    return response.data;
  },
};

export default mockFiscal;
```

Use esses helpers para alimentar formulários de testes antes de implementar o fluxo com o certificado verdadeiro.

## 5. Fluxo sugerido para o frontend

1. **Carregar dados de teste** (`GET /test-data`) ao iniciar tela de cadastro de nota, preencher selects (CNPJ, produtos, CFOP, etc.).
2. **Emitir nota de teste** chamando `issue-note` ao enviar formulário. Use o retorno (`accessKey`, `xml`, `danfeUrl`) para mostrar resumo e QR Code.
3. **Simular eventos**: use `cancel-note`, `send-correction` e `disable-numbering` para testar mensagens de sucesso/erro/erro de validação.
4. **Validar certificado mock** com `validate-certificate` para garantir que a tela de upload e senha está funcionando (pode mandar `certificateData: 'mock-base64'`).
5. **Guardar respostas** (ex: `accessKey`) no estado/historico para permitir operações de cancelamento e rastreamento no frontend.

## 6. Comportamento esperado no UI

- Exibir alertas (toasts) com `status` retornado (`authorized`, `cancelled`, etc.).
- Mostrar `danfeUrl`/`consultUrl` para o usuário clicar e validar desenho do documento.
- Notificar quando a validação do certificado retornar `valid: true`.
- Permitir reemitir nota e usar `accessKey` para testar cancelamento e carta de correção.

## 7. Testes automatizados

Crie testes unitários/mock (Jest) usando `jest.mock('../services/api')` e retorne os dados do mock fiscal. Isso garante cobertura para formulários e fluxo de erros.

## 8. Próximos passos na produção

Quando estiver pronto para produzir:

1. Substitua chamadas `/mock-sefaz/*` pelos endpoints normais (`/business/fiscal/...`).
2. Faça upload real do certificado A1 via API real (`/business/fiscal/certificates`).
3. Garanta rotinas de alertas (monitoramento de expiração) descritas em `business/docs/FISCAL_INTEGRATION.md`.

---

Se quiser, posso montar um exemplo completo (React + formulário + resultados do mock) ou gerar um Postman collection. Quer que eu faça isso?
