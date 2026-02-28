import apiClient from './client';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  userType: 'consumer' | 'business';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive?: boolean;
  };
  access_token: string;
  token?: string;
  refreshToken?: string;
  refresh_token?: string;
}

export const authApi = {
  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', dto);
    console.log('📡 Register response completo:', response);
    console.log('📦 Register response.data:', response.data);
    
    // A API retorna { success: true, data: { access_token, user } }
    let authData = response.data;
    
    if (response.data.data) {
      authData = response.data.data;
    }
    
    console.log('✅ Auth data extraído:', authData);
    
    // Normalizar: access_token -> token
    const normalizedData = {
      user: authData.user,
      token: authData.access_token || authData.token,
      refreshToken: authData.refresh_token || authData.refreshToken,
      access_token: authData.access_token || authData.token,
    };
    
    console.log('✅ Auth data normalizado:', normalizedData);
    
    // Se não tiver token, algo está errado
    if (!normalizedData.token) {
      console.error('❌ Token não encontrado na resposta!');
      throw new Error('Token não retornado pela API');
    }
    
    return normalizedData;
  },

  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', dto);
    console.log('📡 Login response completo:', response);
    console.log('📦 Login response.data:', response.data);
    
    // A API retorna { success: true, data: { access_token, user } }
    let authData = response.data;
    
    if (response.data.data) {
      authData = response.data.data;
    }
    
    console.log('✅ Auth data extraído:', authData);
    
    // Normalizar: access_token -> token
    const normalizedData = {
      user: authData.user,
      token: authData.access_token || authData.token,
      refreshToken: authData.refresh_token || authData.refreshToken,
      access_token: authData.access_token || authData.token,
    };
    
    console.log('✅ Auth data normalizado:', normalizedData);
    
    // Se não tiver token, algo está errado
    if (!normalizedData.token) {
      console.error('❌ Token não encontrado na resposta!');
      throw new Error('Token não retornado pela API');
    }
    
    return normalizedData;
  },

  me: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
};
