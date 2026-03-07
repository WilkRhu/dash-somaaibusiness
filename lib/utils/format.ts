export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
};

export const formatCNPJ = (cnpj: string): string => {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

export const formatCPF = (cpf: string): string => {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};

export const formatPhone = (phone: string): string => {
  return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
};

// Máscaras para inputs (aplicam formatação enquanto o usuário digita)
export const maskCNPJ = (value: string): string => {
  // Remove tudo que não é dígito
  value = value.replace(/\D/g, '');
  
  // Limita a 14 dígitos
  value = value.substring(0, 14);
  
  // Aplica a máscara progressivamente
  if (value.length <= 2) {
    return value;
  } else if (value.length <= 5) {
    return value.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
  } else if (value.length <= 8) {
    return value.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else if (value.length <= 12) {
    return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
  } else {
    return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
  }
};

export const maskCPF = (value: string): string => {
  value = value.replace(/\D/g, '');
  value = value.substring(0, 11);
  
  if (value.length <= 3) {
    return value;
  } else if (value.length <= 6) {
    return value.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
  } else if (value.length <= 9) {
    return value.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else {
    return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
  }
};

export const maskPhone = (value: string): string => {
  value = value.replace(/\D/g, '');
  value = value.substring(0, 11);
  
  if (value.length <= 2) {
    return value;
  } else if (value.length <= 7) {
    return value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else {
    return value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }
};

export const maskCEP = (value: string): string => {
  value = value.replace(/\D/g, '');
  value = value.substring(0, 8);
  
  if (value.length <= 5) {
    return value;
  } else {
    return value.replace(/^(\d{5})(\d{0,3})/, '$1-$2');
  }
};

// Remove a máscara (retorna apenas números)
export const unmask = (value: string): string => {
  return value.replace(/\D/g, '');
};

// Máscara de moeda (R$)
export const maskCurrency = (value: string): string => {
  // Remove tudo que não é dígito
  value = value.replace(/\D/g, '');
  
  // Converte para número e divide por 100 para ter os centavos
  const numberValue = parseInt(value || '0') / 100;
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue);
};

// Converte string com máscara de moeda para número
export const parseCurrency = (value: string): number => {
  // Remove tudo que não é dígito
  const cleanValue = value.replace(/\D/g, '');
  
  // Converte para número e divide por 100
  return parseInt(cleanValue || '0') / 100;
};

// Formata número para input de moeda (sem símbolo R$)
export const formatCurrencyInput = (value: number): string => {
  return value.toFixed(2).replace('.', ',');
};

// Formata número inteiro (quantidade)
export const formatNumber = (value: number): string => {
  return Math.floor(value).toString();
};

// Converte File para base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Converte array de Files para array de base64
export const filesToBase64 = async (files: File[]): Promise<string[]> => {
  return Promise.all(files.map(file => fileToBase64(file)));
};
