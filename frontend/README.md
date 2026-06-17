# 🎨 CNHFácil - Frontend

Este é o diretório do frontend da plataforma **CNHFácil**, uma aplicação web desenvolvida com **React**, **Vite** e **Tailwind CSS v4** projetada para auxiliar alunos de autoescolas no processo de habilitação (carteira de motorista) e treinar para a prova teórica do DETRAN.

A aplicação é moderna, responsiva, estilizada em tema escuro com detalhes em *glassmorphism* e totalmente conectada às APIs do backend da plataforma.

---

## 📂 Organização do Projeto

Abaixo está a estrutura principal de arquivos desenvolvida no frontend:

```text
frontend/
├── public/
│   └── favicon.ico               # Ícone da aplicação
├── src/
│   ├── assets/                   # Arquivos de mídia e logotipos
│   ├── components/               # Componentes reutilizáveis
│   ├── context/
│   │   └── AuthContext.jsx       # Provedor global de estado de login e autenticação
│   ├── services/
│   │   └── api.js                # Cliente de API centralizado com Axios e JWT interceptor
│   ├── views/
│   │   ├── Login.jsx             # Tela de Autenticação (Login e Cadastro dinâmicos)
│   │   ├── Dashboard.jsx         # Painel do Aluno e status teóricos/financeiros
│   │   ├── Simulado.jsx          # Painel de provas e correção do simulado
│   │   └── AdminQuestoes.jsx     # Área administrativa para CRUD de questões
│   ├── App.css                   # Limpeza de estilos padrão
│   ├── App.jsx                   # Roteamento baseado em estados reativos
│   ├── index.css                 # Importações e customização de tema do Tailwind CSS v4
│   └── main.jsx                  # Ponto de entrada do React
├── index.html                    # Estrutura HTML base configurada para SEO (pt-BR)
├── package.json                  # Dependências e scripts npm
└── vite.config.js                # Configurações do Vite (com proxy e Tailwind v4)
```

---

## 🚀 Funcionalidades da Interface

1. **Portal de Autenticação Interativo**:
   - Tela com animações premium e de fácil alternância entre Login e Registro.
   - Suporte a seleção de categoria de CNH (A, B, AB, C, D) e cargos (Aluno, Instrutor ou Admin) no cadastro.
   - Atalhos rápidos na tela com as credenciais padrão de testes.

2. **Painel do Aluno (Dashboard)**:
   - Indicadores gráficos e estatísticos de simulados (total realizados, média de acertos, melhor nota e total de questões resolvidas).
   - Progresso detalhado das aulas teóricas obrigatórias organizadas por matérias.
   - Lista da frota de veículos (carros/motos) cadastrados e seus respectivos status.
   - Histórico interativo contendo datas, notas e status de aprovação de todos os simulados respondidos.
   - Resumo financeiro do curso (total pago, saldo restante e próxima parcela) e status da documentação física (exame médico, psicotécnico).

3. **Painel de Simulados do DETRAN**:
   - Menu de configuração para escolher o tipo de simulado (Geral ou por Matéria Específica) e número de questões (10, 30 ou 40).
   - Cronômetro no topo acompanhando o tempo transcorrido no exame.
   - Barra de progresso visual e atalhos numéricos rápidos para saltar diretamente para qualquer questão.
   - Tela de correção com exibição de nota, indicação clara de Aprovação (nota >= 70%) e listagem do gabarito oficial com a sua resposta vs. a resposta correta de forma comentada.

4. **Gerenciador Administrativo de Questões**:
   - Disponível apenas para contas com perfil `ADMIN` ou `INSTRUTOR`.
   - Filtro de questões por matéria em tempo real.
   - Modal interativo para criação e edição rápida de enunciados, alternativas e indicação de gabarito correto.
   - Botão para exclusão instantânea de questões no servidor.

---

## 🛠️ Instalação e Execução Local

### Pré-requisitos
- Node.js (versão 18 ou superior) instalado.
- Certifique-se de que o **Backend** esteja rodando localmente (porta padrão `3000`).

### Passo a Passo

1. **Navegue até a pasta do frontend**:
   ```bash
   cd frontend
   ```

2. **Instale as dependências do projeto**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   *Por padrão, a aplicação estará disponível em seu navegador no endereço: [http://localhost:5173](http://localhost:5173).*

4. **Gerar a versão de produção (Opcional)**:
   ```bash
   npm run build
   ```

---

## 🔑 Credenciais Padrão de Teste (Iniciais)

Você pode logar com as credenciais abaixo para testar as duas visões (Aluno vs. Admin):

* **Painel do Aluno**:
  * **E-mail**: `duda.aluno@email.com`
  * **Senha**: `12345678`
* **Painel do Administrador**:
  * **E-mail**: `admin@cnhfacil.com`
  * **Senha**: `123456`
