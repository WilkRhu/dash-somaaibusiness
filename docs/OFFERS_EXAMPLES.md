# Exemplos de Ofertas - Payloads

## 1. Oferta Tradicional (com data de término)

```json
{
  "itemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Promoção de Verão",
  "description": "Desconto especial para produtos de verão",
  "offerPrice": 15.90,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z"
}
```

**Resultado:** Oferta ativa de 01/01 até 31/01. Será desativada automaticamente em 31/01 às 23:59:59 com notificação.

---

## 2. Flash Sale - 1 hora

```json
{
  "itemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Flash Sale - 1 hora apenas!",
  "description": "Corra! Oferta válida por apenas 1 hora",
  "offerPrice": 12.90,
  "startDate": "2024-01-15T14:00:00Z",
  "durationHours": 1
}
```

**Resultado:** Oferta ativa das 14:00 às 15:00. `endDate` calculado automaticamente: 15:00.

---

## 3. Oferta de 6 horas

```json
{
  "itemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Oferta Especial - 6 horas",
  "description": "Aproveite por 6 horas",
  "offerPrice": 18.90,
  "startDate": "2024-01-15T10:00:00Z",
  "durationHours": 6
}
```

**Resultado:** Oferta ativa das 10:00 às 16:00.

---

## 4. Oferta de 24 horas (1 dia)

```json
{
  "itemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Oferta do Dia",
  "description": "Válido por 24 horas",
  "offerPrice": 22.90,
  "startDate": "2024-01-15T00:00:00Z",
  "durationHours": 24
}
```

**Resultado:** Oferta ativa por 24 horas completas.

---

## 5. Oferta de 48 horas (2 dias)

```json
{
  "itemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Super Oferta - 48 horas",
  "description": "Dois dias de desconto especial",
  "offerPrice": 19.90,
  "startDate": "2024-01-15T00:00:00Z",
  "durationHours": 48
}
```

**Resultado:** Oferta ativa por 2 dias completos.

---

## 6. Oferta Semanal (168 horas)

```json
{
  "itemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Oferta da Semana",
  "description": "Promoção válida por toda a semana",
  "offerPrice": 25.90,
  "startDate": "2024-01-15T00:00:00Z",
  "durationHours": 168
}
```

**Resultado:** Oferta ativa por 7 dias (1 semana).

---

## 7. Liquidação - Enquanto Durar o Estoque

```json
{
  "itemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Liquidação Total - Enquanto Durar o Estoque",
  "description": "Últimas unidades com desconto imperdível!",
  "offerPrice": 9.90,
  "startDate": "2024-01-01T00:00:00Z",
  "whileStockLasts": true
}
```

**Resultado:** 
- Oferta permanece ativa até o estoque zerar
- Quando estoque = 0, oferta é desativada automaticamente
- Estabelecimento recebe notificação: "Oferta 'Liquidação Total' foi desativada. Motivo: Estoque do produto esgotado"

---

## 8. Oferta Combinada (Duração + Estoque)

```json
{
  "itemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Black Friday - 24h ou Até Acabar",
  "description": "Válido por 24 horas ou enquanto durar o estoque",
  "offerPrice": 14.90,
  "startDate": "2024-11-24T00:00:00Z",
  "durationHours": 24,
  "whileStockLasts": true
}
```

**Resultado:** 
- Oferta expira em 24 horas OU quando o estoque acabar (o que ocorrer primeiro)
- Notificação enviada em ambos os casos

---

## Tabela de Conversão de Duração

| Período | Horas |
|---------|-------|
| 30 minutos | 0.5 |
| 1 hora | 1 |
| 2 horas | 2 |
| 3 horas | 3 |
| 6 horas | 6 |
| 12 horas | 12 |
| 24 horas (1 dia) | 24 |
| 48 horas (2 dias) | 48 |
| 72 horas (3 dias) | 72 |
| 168 horas (1 semana) | 168 |
| 336 horas (2 semanas) | 336 |
| 720 horas (30 dias) | 720 |

---

## Notificações Automáticas

### Quando a oferta expira por tempo:
```
Oferta "Flash Sale - 1 hora apenas!" foi desativada automaticamente.
Motivo: Período de validade expirado
```

### Quando a oferta expira por estoque:
```
Oferta "Liquidação Total - Enquanto Durar o Estoque" foi desativada automaticamente.
Motivo: Estoque do produto esgotado
```

---

## Dicas de Uso

1. **Flash Sales**: Use `durationHours` com valores pequenos (1-6 horas)
2. **Ofertas Diárias**: Use `durationHours: 24`
3. **Liquidações**: Use `whileStockLasts: true`
4. **Promoções Longas**: Use `endDate` para controle preciso
5. **Urgência Máxima**: Combine `durationHours` + `whileStockLasts`
