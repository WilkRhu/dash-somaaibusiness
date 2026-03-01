# HTTPS para Desenvolvimento - Mercado Pago

## ⚠️ Problema
O Mercado Pago exige HTTPS para processar pagamentos com cartão de crédito.

## 🔧 Solução 1: ngrok (Mais Rápido)

### 1. Instalar ngrok
```bash
# macOS
brew install ngrok

# Linux
snap install ngrok

# Windows
# Baixe em: https://ngrok.com/download
```

### 2. Iniciar túnel HTTPS
```bash
ngrok http 3000
```

### 3. Usar URL HTTPS
O ngrok vai gerar uma URL tipo:
```
https://abc123.ngrok.io
```

Acesse essa URL no navegador ao invés de `localhost:3000`

## 🔧 Solução 2: mkcert (HTTPS Local)

### 1. Instalar mkcert
```bash
# macOS
brew install mkcert
brew install nss # para Firefox

# Linux
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/

# Windows
choco install mkcert
```

### 2. Criar certificado local
```bash
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

### 3. Configurar Next.js

Crie `server.js`:
```javascript
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
  });
});
```

### 4. Atualizar package.json
```json
{
  "scripts": {
    "dev": "node server.js",
    "dev:http": "next dev"
  }
}
```

### 5. Rodar com HTTPS
```bash
npm run dev
```

Acesse: `https://localhost:3000`

## 🎯 Recomendação

Para desenvolvimento rápido: **Use ngrok**
- Não precisa configurar nada
- Funciona imediatamente
- Pode compartilhar com outros dispositivos

Para desenvolvimento contínuo: **Use mkcert**
- HTTPS local permanente
- Não depende de serviço externo
- Mais rápido (sem latência)

## 📝 Nota sobre PIX

PIX funciona normalmente em HTTP (localhost), apenas cartão de crédito precisa HTTPS.
