# Upload de Imagens - Entregadores

## 📋 Resumo

Implementação de upload de imagens (Base64) para entregadores com suporte a S3 (principal) e FTP (fallback).

## 🔄 Fluxo de Upload

```
Cliente envia Base64
    ↓
DeliveryDriverService recebe
    ↓
Converte Base64 → Buffer
    ↓
UploadService.uploadFile()
    ├─ Tenta S3 primeiro
    └─ Se falhar, tenta FTP
    ↓
Retorna URL do arquivo
    ↓
Salva URL no banco de dados
```

## 📸 Endpoints

### 1. Upload Foto de Perfil
```
PATCH /business/establishments/:establishmentId/delivery/drivers/:driverId/profile-photo
```

**Request:**
```json
{
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "driver-789",
    "name": "João Silva",
    "profilePhoto": "https://bucket.s3.region.amazonaws.com/drivers/profile/profile-driver-789-1711000000000.jpg"
  },
  "message": "Foto de perfil atualizada com sucesso"
}
```

### 2. Upload Foto do Veículo
```
PATCH /business/establishments/:establishmentId/delivery/drivers/:driverId/vehicle-photo
```

**Request:**
```json
{
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/..."
}
```

### 3. Upload Ambas as Fotos
```
PATCH /business/establishments/:establishmentId/delivery/drivers/:driverId/photos
```

**Request:**
```json
{
  "profilePhoto": "data:image/jpeg;base64,...",
  "vehiclePhoto": "data:image/jpeg;base64,..."
}
```

## 🔧 Implementação Técnica

### Serviço de Upload (UploadService)

Localização: `src/shared/providers/upload/upload.service.ts`

**Características:**
- Tenta S3 primeiro (se configurado)
- Fallback automático para FTP se S3 falhar
- Retorna `UploadResult` com URL e provedor usado

```typescript
interface UploadResult {
  url: string;
  provider: 'S3' | 'FTP';
}
```

### Serviço de Entregador (DeliveryDriverService)

Localização: `src/modules/business/delivery/services/delivery-driver.service.ts`

**Métodos:**
- `uploadProfilePhoto(driverId, photoData)` - Upload foto de perfil
- `uploadVehiclePhoto(driverId, photoData)` - Upload foto do veículo
- `uploadDriverPhotos(driverId, profilePhoto?, vehiclePhoto?)` - Upload ambas

**Processo:**
1. Recebe string Base64
2. Converte para Buffer
3. Gera nome único: `{tipo}-{driverId}-{timestamp}.jpg`
4. Chama `UploadService.uploadFile()`
5. Salva URL retornada no banco

## 📁 Estrutura de Pastas no S3/FTP

```
drivers/
├── profile/
│   ├── profile-driver-789-1711000000000.jpg
│   └── profile-driver-456-1711000000001.jpg
└── vehicle/
    ├── vehicle-driver-789-1711000000000.jpg
    └── vehicle-driver-456-1711000000001.jpg
```

## 🔐 Configuração

### Variáveis de Ambiente

**S3:**
```env
AWS_REGION=us-east-1
AWS_S3_BUCKET=seu-bucket
AWS_ACCESS_KEY_ID=sua-chave
AWS_SECRET_ACCESS_KEY=sua-senha
UPLOAD_PROVIDER=S3  # ou FTP para usar apenas FTP
```

**FTP (Fallback):**
```env
FTP_HOST=ftp.example.com
FTP_USER=usuario
FTP_PASS=senha
FTP_PORT=21
FTP_SECURE=false
FTP_BASE_PATH=/uploads
FTP_PUBLIC_URL=https://example.com
```

## 📊 Banco de Dados

### Campos na Entidade DeliveryDriver

```typescript
@Column({ type: 'text', nullable: true })
profilePhoto: string;  // URL da foto de perfil

@Column({ type: 'text', nullable: true })
vehiclePhoto: string;  // URL da foto do veículo
```

## ✅ Validações

- Base64 válido (convertível para Buffer)
- Arquivo não vazio
- Extensão detectada automaticamente (jpg, png, gif, etc)
- Content-Type definido corretamente

## 🚀 Exemplo de Uso (Frontend)

```typescript
// Converter imagem para Base64
const fileInput = document.getElementById('photo') as HTMLInputElement;
const file = fileInput.files?.[0];

if (file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64 = e.target?.result as string;
    
    // Enviar para API
    const response = await fetch(
      `/business/establishments/${estId}/delivery/drivers/${driverId}/profile-photo`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo: base64 })
      }
    );
    
    const result = await response.json();
    console.log('URL da foto:', result.data.profilePhoto);
  };
  
  reader.readAsDataURL(file);
}
```

## 📝 Logs

Ao fazer upload, você verá logs como:

```
[DeliveryDriverService] 📸 Salvando foto de perfil do entregador: driver-789
[UploadService] Tentando upload via S3...
[S3Service] Arquivo enviado para S3: https://bucket.s3.us-east-1.amazonaws.com/drivers/profile/profile-driver-789-1711000000000.jpg
[DeliveryDriverService] ✅ Foto de perfil salva: driver-789 - https://bucket.s3.us-east-1.amazonaws.com/drivers/profile/profile-driver-789-1711000000000.jpg (S3)
```

Ou em caso de fallback:

```
[UploadService] Tentando upload via S3...
[UploadService] Falha no S3, tentando FTP: AWS_S3_BUCKET não configurado
[FtpService] Conectando ao FTP Host: ftp.example.com
[FtpService] Arquivo enviado com sucesso para: /uploads/drivers/profile/profile-driver-789-1711000000000.jpg
[DeliveryDriverService] ✅ Foto de perfil salva: driver-789 - https://example.com/public_html/somaai/uploads/drivers/profile/profile-driver-789-1711000000000.jpg (FTP)
```

## 🔗 Referências

- [S3Service](../src/shared/providers/upload/s3.service.ts)
- [FtpService](../src/shared/providers/ftp/ftp.service.ts)
- [UploadService](../src/shared/providers/upload/upload.service.ts)
- [DeliveryDriverService](../src/modules/business/delivery/services/delivery-driver.service.ts)
