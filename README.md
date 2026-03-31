# CN02 P1 — Frontend (React + Vite)

Frontend web do projeto, consumindo a API do backend via HTTP.

## Pré-requisitos

- Node.js 18+ (recomendado 20+)

## Configuração (.env)

A URL do backend é configurada por:

- `VITE_API_URL`

Arquivos:

- `./.env.example` (exemplo)
- `./.env` (seu local)

Exemplos:

- Backend local:
  - `VITE_API_URL=http://localhost:4000`
- Backend publicado na Azure:
  - `VITE_API_URL=https://<seu-app>.azurewebsites.net`

Observação: o Vite só lê variáveis `VITE_*` ao iniciar. Se mudar `VITE_API_URL`, reinicie o `npm run dev`.

## Rodar em desenvolvimento

```bash
cd frontend
npm install
npm run dev
```

Abre em `http://localhost:5173/`.

## Build e preview

Build de produção:

```bash
cd frontend
npm run build
```

Preview local do build:

```bash
cd frontend
npm run preview
```

## Dicas de troubleshooting

### Página em branco

- Abra o DevTools (F12) e veja:
  - Console (erros JS)
  - Network (requisições para `/api/...`)

### Erro de CORS

Se o backend bloquear o navegador por CORS, ajuste no backend:

- `CORS_ORIGINS` deve incluir a origem do frontend (`http://localhost:5173`, `http://127.0.0.1:5173` etc.)
- Em ambientes publicados, pode usar `CORS_ORIGINS=*` no backend (se isso fizer sentido para o seu cenário)

### API fora do ar / URL errada

Confirme a healthcheck no backend:

- `<VITE_API_URL>/api/health`

## Páginas

- Produtos (CRUD + upload de imagem)
- Clientes (CRUD + histórico)
- Checkout
- Área do cliente
