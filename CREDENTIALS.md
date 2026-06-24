# Credenciais de teste para desenvolvimento

## Usuários de Teste (fornecidos via seed do banco)

Após rodar `npm run prisma:deploy` (ou `npm run prisma:seed`), use essas credenciais para fazer login:

### Admin
- Email: `admin@cnhfacil.com`
- Senha: `admin123`

### Aluno
- Email: `aluno@cnhfacil.com`
- Senha: `aluno123`

> Instrutores devem ser cadastrados pela tela de cadastro selecionando o perfil "Sou Instrutor".

## Variáveis de Ambiente

### Backend (`backend/.env`)
```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/cnhfacil"
PORT=3000
JWT_SECRET="sua_chave_secreta_super_segura"
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:3000/api
```

## Rotas da Aplicação

- `/login` — Tela de login (aluno ou instrutor)
- `/cadastro` — Cadastro de aluno ou instrutor
- `/inicio` — Dashboard do aluno
- `/cursos` — Lista de cursos
- `/aulas/:cursoId` — Vídeo-aulas e conteúdo teórico
- `/simulados` — Simulados por tópico
- `/desempenho` — Histórico e desempenho por categoria
- `/perfil` — Dados do perfil do usuário
- `/instrutores` — Lista de instrutores cadastrados
