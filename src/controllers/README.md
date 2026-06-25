# 🎮 Controllers (Controladores)

Esta pasta centraliza toda a **lógica de negócio** e controle de fluxo do backend da aplicação CNHFácil. Cada controlador é responsável por interceptar as requisições HTTP (enviadas pelas rotas), processar os parâmetros, interagir com o estado em memória (`dadosMockados.js`) e responder de forma adequada com o status HTTP correto.

---

## 📂 Descrição dos Controladores

Abaixo está o papel de cada arquivo contido nesta pasta:

### 1. `autenticacaoController.js`
- **Função**: Gerencia o ciclo de vida da sessão do usuário.
- **Como funciona**: 
  - **Login**: Recebe e-mail e senha, busca o usuário no banco de dados em memória, compara o hash da senha usando `bcryptjs` e gera um token de acesso **JWT** assinado contendo as informações de permissão.
  - **Registro**: Cria novos usuários garantindo que o e-mail seja único e salvando a senha criptografada.

### 2. `questoesController.js`
- **Função**: Controla o CRUD (Create, Read, Update, Delete) de questões do DETRAN.
- **Como funciona**:
  - Permite listar todas as questões ou filtrá-las por matéria (`tema`).
  - Permite a visualização individual e as operações de inclusão, alteração e exclusão de questões (operações restritas a usuários autenticados).

### 3. `simuladoController.js`
- **Função**: Executa a lógica de geração e correção de simulados de provas.
- **Como funciona**:
  - **Geração**: Filtra as questões por matéria ou de forma geral, realiza o embaralhamento e recorta a quantidade solicitada. Ele limpa o campo `correctAnswer` antes de enviar ao frontend para evitar fraudes/inspeções de rede.
  - **Correção**: Compara as opções enviadas pelo usuário com o gabarito real em memória, gera um feedback estruturado (indicando acerto/erro para cada questão) e anexa o resultado ao histórico do aluno.

### 4. `perfilController.js`
- **Função**: Expõe dados cadastrais, financeiros e o desempenho analítico do aluno.
- **Como funciona**:
  - Retorna o perfil completo do usuário logado via token.
  - Calcula dinamicamente as métricas de desempenho (média geral de acertos, melhor nota de simulado, total de questões respondidas e histórico de evolução) a partir das tentativas registradas no histórico.

### 5. `veiculoController.js`
- **Função**: Lista a frota de veículos disponíveis.
- **Como funciona**: Retorna a lista de carros e motos com suas respectivas placas, categorias e status de disponibilidade.

### 6. `aulaController.js`
- **Função**: Retorna o progresso de disciplinas e horas das aulas teóricas.
- **Como funciona**: Mapeia as matérias do curso teórico e calcula o percentual de conclusão baseado nas aulas assistidas.

---

## 🛠️ Boas Práticas Adotadas nos Controllers
- **Tratamento de Erros**: Todas as funções são envelopadas em blocos `try/catch` para capturar exceções inesperadas e retornar um JSON formatado com status `500` (Erro interno do servidor).
- **Validação de Entrada**: Verificação obrigatória dos campos enviados no corpo (`req.body`) ou parâmetros de consulta (`req.query` e `req.params`) antes de prosseguir com o processamento.
- **Respostas Padronizadas**: Utilização consistente de códigos de status HTTP apropriados:
  - `200 OK` para consultas e atualizações bem-sucedidas.
  - `201 Created` para inserções bem-sucedidas.
  - `400 Bad Request` para erros de validação e dados inválidos.
  - `401 Unauthorized` para falhas de autenticação.
  - `404 Not Found` para recursos inexistentes.