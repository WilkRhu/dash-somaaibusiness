# Quick Start - Gerenciamento de Publicidades

## 🚀 Começar Agora

### 1. Acessar o Painel
```
URL: https://seu-app.com/admin/advertisements
Requer: role = super_admin
```

### 2. Criar Publicidade
```
1. Clique em "Nova Publicidade"
2. Preencha os campos:
   - Título: "Promoção Especial"
   - Descrição: "Ganhe 20% de desconto"
   - URL da Imagem: "https://..."
   - URL de Ação: "https://somaai.com/promo"
   - Data de Início: 2024-04-22
   - Data de Término: 2024-05-22
3. Clique em "Salvar Publicidade"
```

### 3. Editar Publicidade
```
1. Clique em "Editar" na tabela
2. Modifique os campos desejados
3. Clique em "Salvar Publicidade"
```

### 4. Deletar Publicidade
```
1. Clique em "Deletar" na tabela
2. Confirme a deleção
```

---

## 📋 Campos Obrigatórios

- ✅ Título
- ✅ Descrição
- ✅ URL da Imagem
- ✅ URL de Ação
- ✅ Data de Início
- ✅ Data de Término

---

## 🎨 Campos Opcionais

- ❌ Cor de Fundo (padrão: #10b981)
- ❌ Cores do Gradiente (padrão: ["#10b981", "#059669"])
- ❌ Texto do Botão (padrão: "Aproveitar")
- ❌ Prioridade (padrão: 1)
- ❌ Plataforma (padrão: "all")
- ❌ Ativo (padrão: true)

---

## 📊 Visualizar Estatísticas

Na tabela, você pode ver:
- **Impressões:** Quantas vezes a publicidade foi vista
- **Cliques:** Quantas vezes foi clicada
- **CTR:** Click-through rate (%)

---

## 🔗 Arquivos Criados

```
✅ app/admin/advertisements/page.tsx
✅ components/admin/advertisements/advertisement-form.tsx
✅ components/admin/advertisements/advertisements-table.tsx
✅ lib/api/advertisements.ts
✅ lib/hooks/use-toast.ts
✅ lib/utils/date-formatters.ts
✅ docs/ADMIN_ADVERTISEMENTS_MANAGEMENT.md
✅ docs/ADMIN_ADVERTISEMENTS_STRUCTURE.md
```

---

## 🎯 Próximos Passos

1. **Testar a página**
   ```
   npm run dev
   Acesse: http://localhost:3000/admin/advertisements
   ```

2. **Criar primeira publicidade**
   - Clique em "Nova Publicidade"
   - Preencha o formulário
   - Clique em "Salvar"

3. **Verificar no app**
   - Abra o app mobile/web
   - Vá para a home
   - Procure pelo banner de publicidade

4. **Monitorar estatísticas**
   - Volte ao painel
   - Veja impressões e cliques

---

## 🆘 Troubleshooting

### Página não carrega
- Verificar se você é super_admin
- Verificar se o backend está online
- Verificar console para erros

### Publicidade não aparece no app
- Verificar se está ativa (isActive = true)
- Verificar se a data está correta
- Verificar se a URL da imagem é válida

### Erro ao salvar
- Verificar se todos os campos obrigatórios foram preenchidos
- Verificar se a data de término é após a data de início
- Verificar se a URL da imagem é HTTPS

---

## 📞 Suporte

Para mais informações, consulte:
- `docs/ADMIN_ADVERTISEMENTS_MANAGEMENT.md` - Documentação completa
- `docs/ADVERTISEMENT_DATA_FLOW.md` - Fluxo de dados
- `docs/ADMIN_ADVERTISEMENTS_STRUCTURE.md` - Estrutura técnica

---

**Tudo pronto! 🎉**
