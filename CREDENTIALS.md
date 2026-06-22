# Credenciais de teste para desenvolvimento

## Usuários de Teste (fornecidos via seed do banco)

Após rodar `npm run prisma:seed`, use essas credenciais para fazer login:

### Admin
- Email: `admin@cnhfacil.com`
- Senha: `123456`

### Professor/Instrutor
- Email: `professor@cnhfacil.com`
- Senha: `123456`

### Aluno
- Email: `aluno@cnhfacil.com`
- Senha: `123456`

## Variáveis de Ambiente

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/cnhfacil"
PORT=3000
JWT_SECRET="sua_chave_secreta_super_segura"
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## Rotas da Aplicação

- `/` - Página inicial
- `/login` - Tela de login
- `/dashboard` - Dashboard (protegida por autenticação)
- `/404` - Página não encontrada
