# 🛣️ Routes (Rotas)

Esta pasta abriga a definição de todos os **endpoints HTTP** exposicionados pelo backend do CNHFácil. As rotas agem como a porta de entrada da API, determinando quais URLs estão disponíveis, quais métodos HTTP (GET, POST, PUT, DELETE) são aceitos e quais intermediários (middlewares) ou controladores processarão a requisição.

---

## 📂 Organização das Rotas

As rotas são divididas por áreas de responsabilidade, refletindo as necessidades do frontend:

### 1. `authRoutes.js`
- **Prefixo**: `/api/auth`
- **Mapeamento**:
  - `POST /login` -> Executa o login e gera o token JWT.
  - `POST /registro` -> Cadastra um novo usuário aluno, instrutor ou admin.

### 2. `questionRoutes.js`
- **Prefixo**: `/api/questoes`
- **Mapeamento**:
  - `GET /` -> Lista todas as questões com filtro opcional.
  - `GET /:id` -> Obtém detalhes de uma questão.
  - `POST /` -> Cadastra uma nova questão *(Requer Autenticação)*.
  - `PUT /:id` -> Atualiza dados de uma questão *(Requer Autenticação)*.
  - `DELETE /:id` -> Exclui uma questão *(Requer Autenticação)*.

### 3. `simuladoRoutes.js`
- **Prefixo**: `/api/simulados`
- **Mapeamento**:
  - `POST /gerar` -> Cria um teste embaralhado contendo questões seguras.
  - `POST /enviar` -> Submete as respostas para correção e gera feedback imediato.

### 4. `perfilRoutes.js`
- **Prefixo**: `/api`
- **Mapeamento**:
  - `GET /perfil` -> Retorna os dados pessoais e financeiros do usuário atual *(Requer Autenticação)*.
  - `GET /desempenho` -> Retorna o histórico e médias analíticas dos simulados *(Requer Autenticação)*.

### 5. `veiculoRoutes.js`
- **Prefixo**: `/api/veiculos`
- **Mapeamento**:
  - `GET /` -> Lista carros e motos cadastrados na frota.

### 6. `aulaRoutes.js`
- **Prefixo**: `/api/aulas`
- **Mapeamento**:
  - `GET /` -> Retorna as matérias teóricas e o progresso das aulas.

---

## 🔒 Proteção e Segurança (Middlewares)

Algumas rotas são sensíveis (como obter dados do perfil pessoal ou cadastrar questões administrativas). Para garantir que apenas usuários autorizados as acessem, as rotas utilizam o middleware `verificarToken`:

```javascript
import { verificarToken } from '../middlewares/autenticacaoMiddleware.js';

// Rota protegida por autenticação JWT
router.get('/perfil', verificarToken, obterPerfil);
```

Esse middleware intercepta a requisição, valida o header `Authorization: Bearer <TOKEN>` e, caso o token seja válido, anexa as informações do usuário ao objeto `req` antes de chamar o controlador correspondente.

---

## 📄 Autodocumentação via Swagger JSDoc

Todas as rotas nesta pasta contêm blocos de comentários no formato **JSDoc/YAML** acima de suas definições. O pacote `swagger-jsdoc` mapeia esses blocos de documentação em conformidade com o padrão **OpenAPI 3.0.0**.

Exemplo de estrutura documentada:

```javascript
/**
 * @swagger
 * /api/veiculos:
 *   get:
 *     summary: Lista todos os veículos da frota cadastrados
 *     tags: [Veículos]
 *     responses:
 *       200:
 *         description: Lista de veículos obtida com sucesso
 */
```

Isso garante que qualquer alteração de endpoints, parâmetros ou respostas possa ser documentada e testada imediatamente na página interativa do Swagger (`/api-docs`).