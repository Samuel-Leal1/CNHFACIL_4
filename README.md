# 🚀 CNHFácil - Backend

Este diretório contém o backend completo e funcional em **Node.js** com **Express** desenvolvido para o sistema **CNHFácil**. O projeto foi arquitetado sem dependências de bancos de dados complexos externos (utilizando dados em memória) para garantir portabilidade imediata, facilidade de testes e alinhamento de 100% com o frontend da plataforma.

Adicionalmente, disponibiliza uma interface interativa do **Swagger** para teste online e documentação de todas as APIs disponíveis.

---

## 📂 Estrutura de Pastas e Arquivos

Abaixo está a organização modular do backend:

```text
backend/
├── src/
│   ├── config/
│   │   └── swagger.js                # Configurações do Swagger JSDoc
│   ├── controllers/
│   │   ├── autenticacaoController.js # Regras de login e registro
│   │   ├── questoesController.js     # CRUD completo das questões
│   │   ├── simuladoController.js     # Geração e correção de simulados
│   │   ├── perfilController.js       # Estatísticas e dados de perfil do aluno
│   │   ├── veiculoController.js      # Controle de frota de veículos
│   │   └── aulaController.js         # Progresso das aulas do aluno
│   ├── middlewares/
│   │   └── autenticacaoMiddleware.js # Validador de tokens JWT
│   ├── routes/
│   │   ├── autenticacaoRoutes.js     # Rotas /api/auth/* (login, registro)
│   │   ├── questoesRoutes.js         # Rotas /api/questoes/* (CRUD)
│   │   ├── simuladoRoutes.js         # Rotas /api/simulados/* (embaralhar, corrigir)
│   │   ├── perfilRoutes.js           # Rotas /api/perfil e /api/desempenho
│   │   ├── veiculoRoutes.js          # Rotas /api/veiculos
│   │   └── aulaRoutes.js             # Rotas /api/aulas
│   ├── index.js                      # Inicialização principal do servidor
│   └── dadosMockados.js              # Banco de dados simulado em memória
├── .env                              # Variáveis de ambiente (Porta, Segredo JWT)
├── .gitignore                        # Arquivos ignorados pelo Git
└── package.json                      # Script e dependências do projeto
```

---

## ⚙️ Funcionalidades Principais

1. **Autenticação (JWT & BcryptJS)**: Login e cadastro seguros de usuários, com verificação de credenciais criptografadas.
2. **Questões do DETRAN**: CRUD completo com suporte a listagem geral, filtro por tema e operações administrativas protegidas.
3. **Simulados Inteligentes**:
   - Geração aleatória baseada na quantidade desejada de questões ou matérias específicas.
   - Ocultação inteligente do gabarito das questões enviadas ao frontend.
   - Correção automática no servidor, gerando gabarito detalhado e computando pontuação no histórico.
4. **Painel do Aluno**: Cálculo analítico de métricas em tempo real (média de acertos, melhor nota, total de questões respondidas e histórico de evolução).
5. **Aulas e Frota**: Listagem dos cursos assistidos e veículos cadastrados.

---

## 🛠️ Como Instalar e Rodar

### Pré-requisitos
- Ter o **Node.js** (versão 18 ou superior) instalado em sua máquina.

### Passo a Passo

1. **Navegue até a pasta do backend**:
   ```bash
   cd backend
   ```

2. **Instale as dependências necessárias**:
   ```bash
   npm install
   ```

3. **Crie ou configure as Variáveis de Ambiente**:
   O arquivo `.env` já vem pré-configurado no diretório com as seguintes informações padrão:
   ```env
   PORT=3000
   JWT_SECRET=cnh_facil_super_secret_key_2026_dev
   DATABASE_URL="postgresql://postgres:senha123@localhost:5432/cnhfacil?schema=public"
   ```

4. **Configuração e Migração do Banco de Dados (Prisma)**:
   Para gerar o cliente Prisma, rodar as migrações no banco PostgreSQL e popular os dados iniciais:
   ```bash
   # Gerar o Prisma Client
   npm run prisma:generate
   
   # Rodar as migrações (criação das tabelas no banco de dados)
   npm run prisma:migrate
   
   # Executar o seed (popular o banco com dados padrão)
   npm run prisma:seed
   ```

5. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   *Este comando utiliza o Nodemon para reiniciar o servidor automaticamente a cada alteração de arquivo.*

6. **Inicie o servidor em produção**:
   ```bash
   npm start
   ```

---

## 📄 Testando as APIs com o Swagger

Com o servidor rodando (`http://localhost:3000`), você pode acessar a documentação interativa para visualizar e testar todos os endpoints:

👉 **Acesse em seu navegador:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Endpoints Disponíveis para Testes

| Método | Rota | Descrição | Requer Token? |
| :--- | :--- | :--- | :---: |
| **POST** | `/api/auth/login` | Realiza login e retorna o Token JWT | Não |
| **POST** | `/api/auth/registro` | Registra um novo usuário no sistema | Não |
| **GET** | `/api/questoes` | Lista todas as questões com filtro opcional por `tema` | Não |
| **GET** | `/api/questoes/{id}` | Busca os detalhes de uma questão específica | Não |
| **POST** | `/api/questoes` | Cadastra uma nova questão (Admin) | **Sim** |
| **PUT** | `/api/questoes/{id}` | Atualiza uma questão pelo ID (Admin) | **Sim** |
| **DELETE** | `/api/questoes/{id}` | Remove uma questão do banco de dados (Admin) | **Sim** |
| **POST** | `/api/simulados/gerar` | Gera simulado com número específico de questões | Não |
| **POST** | `/api/simulados/enviar` | Corrige o simulado, computa nota e salva histórico | Não |
| **GET** | `/api/perfil` | Obtém dados cadastrais e financeiros do usuário logado | **Sim** |
| **GET** | `/api/desempenho` | Obtém relatórios de acertos e evolução do aluno | **Sim** |
| **GET** | `/api/veiculos` | Lista os carros/motos disponíveis da frota | Não |
| **GET** | `/api/aulas` | Lista cursos cadastrados e o progresso das aulas | Não |

---

## 🔑 Credenciais Padrão de Teste (Iniciais)

Você pode usar as credenciais abaixo para autenticar no Swagger e testar as rotas protegidas:

* **Conta do Aluno (Duda)**:
  * **E-mail**: `duda.aluno@email.com`
  * **Senha**: `12345678`
* **Conta do Administrador**:
  * **E-mail**: `admin@cnhfacil.com`
  * **Senha**: `123456`

> **Como usar o token no Swagger**:
> 1. Chame o endpoint `/api/auth/login` com as credenciais acima.
> 2. Copie a string do `token` retornado.
> 3. Suba até o topo da página do Swagger e clique no botão **Authorize** (com ícone de cadeado).
> 4. Cole o token no campo de texto e clique em **Authorize**. Agora todas as rotas protegidas funcionarão normalmente!