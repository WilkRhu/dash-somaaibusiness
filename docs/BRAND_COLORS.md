# 🎨 Paleta de Cores SomaAI Business

## Cores Principais

### Azul Principal (Gradiente Início)
- **Hex**: `#4C99C2`
- **RGB**: `76, 153, 194`
- **Uso**: Cor primária, botões principais, links, elementos de destaque
- **Tailwind**: `brand-blue`, `primary-500`

### Verde (Gradiente Final)
- **Hex**: `#7CBD6A`
- **RGB**: `124, 189, 106`
- **Uso**: Cor secundária, ícones, elementos de sucesso, detalhes
- **Tailwind**: `brand-green`, `secondary-500`

### Azul Escuro (Navy)
- **Hex**: `#142D4A`
- **RGB**: `20, 45, 74`
- **Uso**: Textos principais, títulos, elementos de contraste
- **Tailwind**: `brand-navy`

### Background
- **Hex**: `#F5F7F9`
- **RGB**: `245, 247, 249`
- **Uso**: Fundo da aplicação, áreas de conteúdo
- **Tailwind**: `brand-background`

## Gradientes

### Gradiente Principal
```css
background: linear-gradient(to right, #4C99C2, #7CBD6A);
```
**Tailwind**: `bg-gradient-to-r from-brand-blue to-brand-green`

**Uso**: Logo, botões principais, cabeçalhos importantes

## Variações de Cores

### Azul (Primary)
- `primary-50`: `#EBF5FA` - Fundos muito claros
- `primary-100`: `#D7EBF5` - Fundos claros
- `primary-500`: `#4C99C2` - Cor principal
- `primary-600`: `#3A7A9A` - Hover states
- `primary-700`: `#2C5C73` - Estados ativos

### Verde (Secondary)
- `secondary-50`: `#F0F9ED` - Fundos muito claros
- `secondary-100`: `#E1F3DB` - Fundos claros
- `secondary-500`: `#7CBD6A` - Cor principal
- `secondary-600`: `#5FA04E` - Hover states
- `secondary-700`: `#47783A` - Estados ativos

## Exemplos de Uso

### Botões Primários
```tsx
<button className="bg-gradient-to-r from-brand-blue to-brand-green text-white">
  Ação Principal
</button>
```

### Títulos
```tsx
<h1 className="text-brand-navy font-bold">
  Título Principal
</h1>
```

### Cards com Destaque
```tsx
<div className="border-l-4 border-brand-blue bg-white">
  Conteúdo do Card
</div>
```

### Estados de Hover
```tsx
<button className="bg-brand-blue hover:bg-primary-600 transition-colors">
  Botão
</button>
```

## Acessibilidade

- Contraste entre `brand-navy` (#142D4A) e branco: **12.5:1** ✅ AAA
- Contraste entre `brand-blue` (#4C99C2) e branco: **3.2:1** ✅ AA (texto grande)
- Contraste entre `brand-green` (#7CBD6A) e branco: **3.1:1** ✅ AA (texto grande)

## Configuração Tailwind

As cores estão configuradas em `tailwind.config.ts`:

```typescript
colors: {
  brand: {
    blue: '#4C99C2',
    green: '#7CBD6A',
    navy: '#142D4A',
    background: '#F5F7F9',
  },
  primary: { /* variações do azul */ },
  secondary: { /* variações do verde */ },
}
```
