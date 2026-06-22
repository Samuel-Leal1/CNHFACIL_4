# CNHFácil

Projeto CNHFácil com estrutura monorepo leve, contendo backend em Node.js/Express e frontend em React/Vite.

## Estrutura do repositório

- `backend/` - API REST com autenticação, simulados, questões, perfil, aulas e veículos.
- `frontend/` - Aplicação web em React usando Vite.
- `CREDENTIALS.md` - Credenciais de teste e exemplos de `.env`.

## Pré-requisitos

- Node.js 16+ instalado
- PostgreSQL instalado e rodando
- Git para versionamento

## Configuração

### 1. Backend

1. Entre na pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` com suas credenciais do banco de dados e JWT:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/cnhfacil"
   PORT=3000
   JWT_SECRET="sua_chave_secreta"
   ```
4. Gere o cliente Prisma:
   ```bash
   npm run prisma:generate
   ```
5. Rode as migrações e o seed:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```
6. Inicie o backend:
   ```bash
   npm run dev
   ```

### 2. Frontend

1. Entre na pasta do frontend:
   ```bash
   cd ../frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` com a URL da API, se necessário:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
4. Inicie o frontend:
   ```bash
   npm run dev
   ```

## Rotas principais

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## Notas importantes

- Não versionar arquivos `.env` reais.
- Caso a porta `3000` esteja em uso, altere em `backend/.env`.
- O arquivo `CREDENTIALS.md` contém credenciais de teste que podem ser usadas após o seed do banco.

## GitHub

Para preparar o repositório local antes de subir para o GitHub:

```bash
git init
git add .
git commit -m "Inicializa repositório CNHFácil"
```

Depois, adicione o remoto e envie para o GitHub:

```bash
git remote add origin <URL_DO_REPOSITORIO>
git push -u origin main
```
