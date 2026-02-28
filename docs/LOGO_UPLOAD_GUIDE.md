# SomaAI Business - Upload de Logo do Estabelecimento

## 🎯 Duas Formas de Upload

### 1️⃣ No momento da criação (JSON com base64)
### 2️⃣ Depois da criação (Multipart/form-data)

---

## 📝 Opção 1: Upload no Create (Base64)

### Endpoint
```
POST /api/business/establishments
```

### Request Body (JSON)
```json
{
  "name": "Mercado do João",
  "cnpj": "12.345.678/0001-90",
  "type": "Supermercado",
  "phone": "+5511999999999",
  "email": "contato@mercado.com",
  "address": "Rua ABC, 123",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "latitude": -23.550520,
  "longitude": -46.633308,
  "description": "Melhor mercado da região",
  "logo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
}
```

### Frontend (React Native)

```typescript
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

async function createEstablishmentWithLogo() {
  // Selecionar imagem
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return;

  // Converter para base64
  const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const logoBase64 = `data:image/jpeg;base64,${base64}`;

  // Criar estabelecimento com logo
  const response = await fetch(`${API_URL}/business/establishments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Mercado do João',
      cnpj: '12.345.678/0001-90',
      type: 'Supermercado',
      city: 'São Paulo',
      state: 'SP',
      logo: logoBase64, // ← Base64 aqui
    }),
  });

  const data = await response.json();
  console.log('Estabelecimento criado:', data.data);
}
```

### Frontend (Next.js)

```typescript
async function createEstablishmentWithLogo(formData: any, logoFile: File) {
  // Converter arquivo para base64
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const logoBase64 = await toBase64(logoFile);

  const response = await fetch('/api/business/establishments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...formData,
      logo: logoBase64, // ← Base64 aqui
    }),
  });

  return response.json();
}
```

---

## 📤 Opção 2: Upload Separado (Multipart)

---

## 📤 Opção 2: Upload Separado (Multipart)

### Endpoint

```
POST /api/business/establishments/:id/logo
```

## 🔐 Autenticação

- Requer token JWT
- Requer ser membro do estabelecimento
- Requer role: `business_owner` ou `business_admin`

## 📤 Request

### Headers
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

### Body (multipart/form-data)
```
logo: File (imagem)
```

### Validações
- **Tipos permitidos:** JPEG, JPG, PNG, WebP
- **Tamanho máximo:** 5MB
- **Campo obrigatório:** `logo`

## ✅ Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": "establishment-uuid",
    "logo": "https://bucket.s3.amazonaws.com/establishments/logos/establishment-logo-uuid-timestamp.jpg"
  },
  "message": "Logo atualizado com sucesso"
}
```

## ❌ Response Errors

### 400 - Bad Request
```json
{
  "statusCode": 400,
  "message": "Nenhum arquivo foi enviado"
}
```

```json
{
  "statusCode": 400,
  "message": "Tipo de arquivo inválido. Apenas JPEG, PNG e WebP são permitidos"
}
```

```json
{
  "statusCode": 400,
  "message": "Arquivo muito grande. Tamanho máximo: 5MB"
}
```

### 403 - Forbidden
```json
{
  "statusCode": 403,
  "message": "Apenas owner ou admin podem atualizar o logo"
}
```

### 404 - Not Found
```json
{
  "statusCode": 404,
  "message": "Estabelecimento não encontrado"
}
```

## 🧪 Testando com cURL

```bash
curl -X POST http://localhost:3000/api/business/establishments/{id}/logo \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "logo=@/caminho/para/logo.jpg"
```

## 🧪 Testando com Postman

1. Método: `POST`
2. URL: `http://localhost:3000/api/business/establishments/{id}/logo`
3. Headers:
   - `Authorization`: `Bearer SEU_TOKEN`
4. Body:
   - Selecione `form-data`
   - Key: `logo` (tipo: File)
   - Value: Selecione o arquivo de imagem

## 📱 Frontend (React Native / Next.js)

### React Native (Expo)

```typescript
import * as ImagePicker from 'expo-image-picker';

async function uploadLogo(establishmentId: string) {
  // Pedir permissão
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Precisamos de permissão para acessar suas fotos');
    return;
  }

  // Selecionar imagem
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1], // Logo quadrado
    quality: 0.8,
  });

  if (result.canceled) return;

  // Preparar FormData
  const formData = new FormData();
  formData.append('logo', {
    uri: result.assets[0].uri,
    type: 'image/jpeg',
    name: 'logo.jpg',
  } as any);

  // Fazer upload
  try {
    const response = await fetch(
      `${API_URL}/business/establishments/${establishmentId}/logo`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    
    if (data.success) {
      console.log('Logo atualizado:', data.data.logo);
      // Atualizar UI
    }
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
  }
}
```

### Next.js (Web)

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LogoUpload({ establishmentId }: { establishmentId: string }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(
        `/api/business/establishments/${establishmentId}/logo`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Logo atualizado com sucesso!');
        // Atualizar estado global ou recarregar dados
      } else {
        alert('Erro ao atualizar logo');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="logo">Logo do Estabelecimento</Label>
        <Input
          id="logo"
          name="logo"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          required
        />
        <p className="text-sm text-gray-500">
          Formatos: JPEG, PNG, WebP. Tamanho máximo: 5MB
        </p>
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </div>
      )}

      <Button type="submit" disabled={uploading}>
        {uploading ? 'Enviando...' : 'Atualizar Logo'}
      </Button>
    </form>
  );
}
```

### API Service (TypeScript)

```typescript
// lib/api/establishments.ts
export const establishmentsApi = {
  // ... outros métodos

  uploadLogo: async (establishmentId: string, file: File) => {
    const formData = new FormData();
    formData.append('logo', file);

    const { data } = await apiClient.post(
      `/business/establishments/${establishmentId}/logo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data;
  },
};
```

## 🔄 Fluxo Completo

### Opção 1: Com Create (Base64)
```
1. Usuário seleciona imagem
   ↓
2. Frontend converte para base64
   ↓
3. Inclui base64 no JSON do create
   ↓
4. POST /business/establishments
   ↓
5. Backend extrai base64
   ↓
6. Upload para S3/FTP
   ↓
7. Salva URL no banco
   ↓
8. Retorna estabelecimento com logo
```

### Opção 2: Upload Separado (Multipart)
```
1. Criar estabelecimento SEM logo
   ↓
2. Usuário seleciona imagem
   ↓
3. Frontend valida (tipo, tamanho)
   ↓
4. Cria FormData com arquivo
   ↓
5. POST /business/establishments/:id/logo
   ↓
6. Backend valida permissões
   ↓
7. Backend valida arquivo
   ↓
8. Upload para S3/FTP
   ↓
9. Atualiza URL no banco
   ↓
10. Retorna URL da imagem
   ↓
11. Frontend atualiza UI
```

## 📝 Notas Importantes

1. **Permissões:** Apenas `business_owner` e `business_admin` podem fazer upload
2. **Substituição:** Upload novo substitui logo anterior
3. **Storage:** Usa o mesmo sistema de upload do avatar (S3 ou FTP)
4. **Path:** Imagens ficam em `establishments/logos/`
5. **Nome:** `establishment-logo-{id}-{timestamp}.{ext}`

## 🎨 Recomendações de Design

- **Tamanho ideal:** 512x512px ou 1024x1024px
- **Formato:** PNG com fundo transparente (melhor)
- **Proporção:** Quadrado (1:1)
- **Peso:** Otimizar para < 500KB

## 🔧 Troubleshooting

### Erro: "Nenhum arquivo foi enviado"
- Verifique se o campo `logo` está no FormData
- Verifique se o Content-Type é `multipart/form-data`

### Erro: "Tipo de arquivo inválido"
- Apenas JPEG, PNG e WebP são aceitos
- Verifique a extensão do arquivo

### Erro: "Arquivo muito grande"
- Comprima a imagem antes de enviar
- Tamanho máximo: 5MB

### Erro 403: "Sem permissão"
- Verifique se o usuário é owner ou admin
- Verifique se o token JWT é válido

---

**Upload de logo implementado com sucesso!** 🎉
