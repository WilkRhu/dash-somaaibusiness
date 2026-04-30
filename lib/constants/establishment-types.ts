export interface EstablishmentTypeOption {
  value: string;
  label: string;
  category: string;
  hasKitchen: boolean;
}

export const ESTABLISHMENT_TYPE_GROUPS = [
  {
    label: '🍽️ Alimentação',
    options: [
      { value: 'Restaurante', label: 'Restaurante', category: 'Alimentação', hasKitchen: true },
      { value: 'Lanchonete', label: 'Lanchonete', category: 'Alimentação', hasKitchen: true },
      { value: 'Padaria', label: 'Padaria', category: 'Alimentação', hasKitchen: true },
      { value: 'Confeitaria', label: 'Confeitaria', category: 'Alimentação', hasKitchen: true },
      { value: 'Pizzaria', label: 'Pizzaria', category: 'Alimentação', hasKitchen: true },
      { value: 'Churrascaria', label: 'Churrascaria', category: 'Alimentação', hasKitchen: true },
      { value: 'Sorveteria', label: 'Sorveteria', category: 'Alimentação', hasKitchen: true },
      { value: 'Café', label: 'Café', category: 'Alimentação', hasKitchen: true },
      { value: 'Bar', label: 'Bar', category: 'Alimentação', hasKitchen: true },
      { value: 'Pub', label: 'Pub', category: 'Alimentação', hasKitchen: true },
      { value: 'Boteco', label: 'Boteco', category: 'Alimentação', hasKitchen: true },
      { value: 'Pastelaria', label: 'Pastelaria', category: 'Alimentação', hasKitchen: true },
      { value: 'Açaí', label: 'Açaí', category: 'Alimentação', hasKitchen: true },
      { value: 'Sushi', label: 'Sushi', category: 'Alimentação', hasKitchen: true },
      { value: 'Comida Árabe', label: 'Comida Árabe', category: 'Alimentação', hasKitchen: true },
      { value: 'Comida Chinesa', label: 'Comida Chinesa', category: 'Alimentação', hasKitchen: true },
      { value: 'Comida Mexicana', label: 'Comida Mexicana', category: 'Alimentação', hasKitchen: true },
      { value: 'Comida Italiana', label: 'Comida Italiana', category: 'Alimentação', hasKitchen: true },
    ],
  },
  {
    label: '🛍️ Varejo',
    options: [
      { value: 'Supermercado', label: 'Supermercado', category: 'Varejo', hasKitchen: false },
      { value: 'Mercado', label: 'Mercado', category: 'Varejo', hasKitchen: false },
      { value: 'Loja de Roupas', label: 'Loja de Roupas', category: 'Varejo', hasKitchen: false },
      { value: 'Loja de Eletrônicos', label: 'Loja de Eletrônicos', category: 'Varejo', hasKitchen: false },
      { value: 'Loja de Móveis', label: 'Loja de Móveis', category: 'Varejo', hasKitchen: false },
      { value: 'Loja de Calçados', label: 'Loja de Calçados', category: 'Varejo', hasKitchen: false },
      { value: 'Loja de Cosméticos', label: 'Loja de Cosméticos', category: 'Varejo', hasKitchen: false },
      { value: 'Loja de Brinquedos', label: 'Loja de Brinquedos', category: 'Varejo', hasKitchen: false },
      { value: 'Loja de Livros', label: 'Loja de Livros', category: 'Varejo', hasKitchen: false },
      { value: 'Loja de Esportes', label: 'Loja de Esportes', category: 'Varejo', hasKitchen: false },
      { value: 'Loja de Departamentos', label: 'Loja de Departamentos', category: 'Varejo', hasKitchen: false },
    ],
  },
  {
    label: '💊 Saúde e Beleza',
    options: [
      { value: 'Farmácia', label: 'Farmácia', category: 'Saúde e Beleza', hasKitchen: false },
      { value: 'Drogaria', label: 'Drogaria', category: 'Saúde e Beleza', hasKitchen: false },
      { value: 'Salão de Beleza', label: 'Salão de Beleza', category: 'Saúde e Beleza', hasKitchen: false },
      { value: 'Barbearia', label: 'Barbearia', category: 'Saúde e Beleza', hasKitchen: false },
      { value: 'Clínica', label: 'Clínica', category: 'Saúde e Beleza', hasKitchen: false },
      { value: 'Consultório', label: 'Consultório', category: 'Saúde e Beleza', hasKitchen: false },
      { value: 'Spa', label: 'Spa', category: 'Saúde e Beleza', hasKitchen: false },
      { value: 'Academia', label: 'Academia', category: 'Saúde e Beleza', hasKitchen: false },
    ],
  },
  {
    label: '🔧 Serviços',
    options: [
      { value: 'Oficina Mecânica', label: 'Oficina Mecânica', category: 'Serviços', hasKitchen: false },
      { value: 'Lavagem de Carros', label: 'Lavagem de Carros', category: 'Serviços', hasKitchen: false },
      { value: 'Encanador', label: 'Encanador', category: 'Serviços', hasKitchen: false },
      { value: 'Eletricista', label: 'Eletricista', category: 'Serviços', hasKitchen: false },
      { value: 'Marcenaria', label: 'Marcenaria', category: 'Serviços', hasKitchen: false },
      { value: 'Serralheria', label: 'Serralheria', category: 'Serviços', hasKitchen: false },
      { value: 'Vidraçaria', label: 'Vidraçaria', category: 'Serviços', hasKitchen: false },
      { value: 'Pintura', label: 'Pintura', category: 'Serviços', hasKitchen: false },
      { value: 'Limpeza', label: 'Limpeza', category: 'Serviços', hasKitchen: false },
      { value: 'Manutenção', label: 'Manutenção', category: 'Serviços', hasKitchen: false },
    ],
  },
  {
    label: '📚 Educação e Cultura',
    options: [
      { value: 'Escola', label: 'Escola', category: 'Educação e Cultura', hasKitchen: false },
      { value: 'Universidade', label: 'Universidade', category: 'Educação e Cultura', hasKitchen: false },
      { value: 'Curso', label: 'Curso', category: 'Educação e Cultura', hasKitchen: false },
      { value: 'Academia de Dança', label: 'Academia de Dança', category: 'Educação e Cultura', hasKitchen: false },
      { value: 'Aula de Música', label: 'Aula de Música', category: 'Educação e Cultura', hasKitchen: false },
      { value: 'Biblioteca', label: 'Biblioteca', category: 'Educação e Cultura', hasKitchen: false },
      { value: 'Museu', label: 'Museu', category: 'Educação e Cultura', hasKitchen: false },
      { value: 'Cinema', label: 'Cinema', category: 'Educação e Cultura', hasKitchen: false },
      { value: 'Teatro', label: 'Teatro', category: 'Educação e Cultura', hasKitchen: false },
    ],
  },
  {
    label: '🏨 Hospedagem e Turismo',
    options: [
      { value: 'Hotel', label: 'Hotel', category: 'Hospedagem e Turismo', hasKitchen: false },
      { value: 'Pousada', label: 'Pousada', category: 'Hospedagem e Turismo', hasKitchen: false },
      { value: 'Hostel', label: 'Hostel', category: 'Hospedagem e Turismo', hasKitchen: false },
      { value: 'Resort', label: 'Resort', category: 'Hospedagem e Turismo', hasKitchen: false },
      { value: 'Agência de Turismo', label: 'Agência de Turismo', category: 'Hospedagem e Turismo', hasKitchen: false },
    ],
  },
  {
    label: '🚗 Transportes',
    options: [
      { value: 'Táxi', label: 'Táxi', category: 'Transportes', hasKitchen: false },
      { value: 'Uber', label: 'Uber', category: 'Transportes', hasKitchen: false },
      { value: 'Ônibus', label: 'Ônibus', category: 'Transportes', hasKitchen: false },
      { value: 'Locadora de Carros', label: 'Locadora de Carros', category: 'Transportes', hasKitchen: false },
    ],
  },
  {
    label: '📦 Outros',
    options: [
      { value: 'Loja', label: 'Loja', category: 'Outros', hasKitchen: false },
      { value: 'Outro', label: 'Outro', category: 'Outros', hasKitchen: false },
    ],
  },
] as const;

export const ESTABLISHMENT_TYPE_OPTIONS = ESTABLISHMENT_TYPE_GROUPS.flatMap((group) => group.options);

export const ESTABLISHMENT_TYPES_WITH_KITCHEN = ESTABLISHMENT_TYPE_OPTIONS
  .filter((option) => option.hasKitchen)
  .map((option) => option.value);

export const isKitchenEstablishment = (type?: string): boolean => {
  return type ? ESTABLISHMENT_TYPE_OPTIONS.some((option) => option.value === type && option.hasKitchen) : false;
};
