# CNHFácil - Setup Local

## ✅ O que foi feito

1. **Frontend reorganizado** - Substituído pelo novo frontend da pasta `cnhfacil-36-organiza-o-doc`
2. **Serviço de API criado** - Arquivo `frontend/src/services/api.js` com axios configurado
3. **Variáveis de ambiente** - Criados `.env` no frontend e backend
4. **Autenticação integrada** - Página de Login conectada com a API backend
5. **Dependências atualizadas** - Axios adicionado ao frontend

## 🚀 Como Rodar Localmente

### Pré-requisitos
- **Node.js** v16+ instalado
- **PostgreSQL** instalado e rodando na porta 5432

### 1️⃣ Configurar o Banco de Dados

```bash
# Criar banco de dados (no terminal do PostgreSQL)
CREATE DATABASE cnhfacil;
```

Editar credenciais em `backend/.env`:
```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/cnhfacil"
PORT=3000
JWT_SECRET="sua_chave_secreta_aqui"
```

### 2️⃣ Rodar o Backend

```bash
cd backend

# Instalar dependências
npm install

# Setup do banco de dados
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed  # Popular com dados mockados

# Iniciar servidor (modo desenvolvimento)
npm run dev

# 📡 Servidor rodando em: http://localhost:3000
# 📄 Documentação em: http://localhost:3000/api-docs
```

### 3️⃣ Rodar o Frontend

```bash
cd frontend

# Instalar dependências (já foi feito)
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# 🌐 Abrir em: http://localhost:5173
```

## 📁 Estrutura do Projeto

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── routes/            # Endpoints da API
│   │   ├── middlewares/       # Autenticação, etc
│   │   └── index.js           # Entrada do servidor
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco de dados
│   │   └── seed.js            # Dados iniciais
│   └── .env                   # Variáveis de ambiente
│
├── frontend/
│   ├── src/
│   │   ├── app/               # Componente raiz + rotas
│   │   ├── pages/             # Telas (Login, Dashboard, etc)
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── services/          # api.js - Cliente HTTP
│   │   ├── layouts/           # Layouts
│   │   ├── styles/            # CSS global
│   │   └── main.jsx           # Entrada
│   ├── .env                   # Variáveis de ambiente
│   └── vite.config.js         # Config do Vite
│
└── cnhfacil-36-organiza-o-doc/  # Frontend antigo (pode deletar)
```

## 🔌 Endpoints da API Disponíveis

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/registro` - Registrar novo usuário

### Questões
- `GET /api/questoes` - Listar todas as questões
- `GET /api/questoes/:id` - Obter questão por ID

### Simulados
- `GET /api/simulados` - Listar simulados
- `POST /api/simulados` - Criar simulado

### Perfil
- `GET /api/perfil` - Dados do perfil autenticado

## 🔐 Autenticação

Após fazer login, o token é salvo automaticamente em `localStorage` e enviado em todas as requisições via o header `Authorization: Bearer <token>`.

## 📝 Próximos Passos

1. Criar mais componentes reutilizáveis
2. Implementar Dashboard com dados reais
3. Adicionar formulários para outras funcionalidades
4. Implementar responsividade completa
5. Adicionar testes unitários

## ⚠️ Importante

- O frontend espera a API em `http://localhost:3000/api` (configurável via `.env`)
- Certifique-se que tanto frontend quanto backend estão rodando em portas diferentes
- Em produção, alterar `JWT_SECRET` para algo mais seguro

## 🐛 Troubleshooting

**Erro: "Cannot find module 'prisma'"**
```bash
cd backend && npm install
```

**Erro: "PostgreSQL connection refused"**
- Verificar se PostgreSQL está rodando: `sudo systemctl status postgresql`
- Verificar credenciais em `.env`

**Erro: "Port already in use"**
```bash
# Encontrar e matar processo na porta
lsof -i :3000  # Backend
lsof -i :5173  # Frontend
kill -9 <PID>
```
