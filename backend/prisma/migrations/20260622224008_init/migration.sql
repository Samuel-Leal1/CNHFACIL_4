-- CreateTable
CREATE TABLE "usuario" (
    "usuario_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_nome" TEXT NOT NULL,
    "usuario_cpf" TEXT NOT NULL,
    "usuario_email" TEXT NOT NULL,
    "usuario_senha" TEXT NOT NULL,
    "usuario_nivel_acesso" TEXT NOT NULL DEFAULT 'aluno',
    "usuario_telefone" TEXT,
    "usuario_foto_perfil" TEXT,
    "usuario_criado_em" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "aluno" (
    "aluno_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "aluno_data_nascimento" DATETIME NOT NULL,
    "aluno_categoria_pretendida" TEXT NOT NULL,
    "aluno_status_aluno" TEXT DEFAULT 'ativo',
    CONSTRAINT "aluno_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "usuario" ("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "instrutor" (
    "instrutor_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "instrutor_numero_credencial" TEXT NOT NULL,
    "instrutor_categoria_cnh" TEXT NOT NULL,
    "instrutor_valor_aula" DECIMAL NOT NULL,
    CONSTRAINT "instrutor_instrutor_id_fkey" FOREIGN KEY ("instrutor_id") REFERENCES "usuario" ("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "simulado" (
    "simulado_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "simulado_titulo" TEXT NOT NULL,
    "simulado_nota_minima" DECIMAL NOT NULL
);

-- CreateTable
CREATE TABLE "questao" (
    "questao_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "simulado_id" INTEGER NOT NULL,
    "questao_enunciado" TEXT NOT NULL,
    "questao_alternativa_a" TEXT NOT NULL,
    "questao_alternativa_b" TEXT NOT NULL,
    "questao_alternativa_c" TEXT NOT NULL,
    "questao_alternativa_d" TEXT NOT NULL,
    "questao_letra_correta" TEXT NOT NULL,
    "questao_categoria" TEXT,
    CONSTRAINT "questao_simulado_id_fkey" FOREIGN KEY ("simulado_id") REFERENCES "simulado" ("simulado_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "curso" (
    "curso_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "curso_titulo" TEXT NOT NULL,
    "curso_carga_horaria" INTEGER NOT NULL,
    "curso_valor" DECIMAL
);

-- CreateTable
CREATE TABLE "aluno_curso" (
    "aluno_id" INTEGER NOT NULL,
    "curso_id" INTEGER NOT NULL,
    "aluno_curso_data_matricula" DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("aluno_id", "curso_id"),
    CONSTRAINT "aluno_curso_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "aluno" ("aluno_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "aluno_curso_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "curso" ("curso_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "aluno_simulado" (
    "aluno_id" INTEGER NOT NULL,
    "simulado_id" INTEGER NOT NULL,
    "aluno_simulado_nota_obtida" DECIMAL,
    "aluno_simulado_data_realizacao" DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("aluno_id", "simulado_id"),
    CONSTRAINT "aluno_simulado_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "aluno" ("aluno_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "aluno_simulado_simulado_id_fkey" FOREIGN KEY ("simulado_id") REFERENCES "simulado" ("simulado_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "veiculo" (
    "veiculo_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "instrutor_id" INTEGER NOT NULL,
    "veiculo_placa" TEXT NOT NULL,
    "veiculo_marca_modelo" TEXT,
    CONSTRAINT "veiculo_instrutor_id_fkey" FOREIGN KEY ("instrutor_id") REFERENCES "instrutor" ("instrutor_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "aula" (
    "aula_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "curso_id" INTEGER NOT NULL,
    "aula_titulo" TEXT NOT NULL,
    "aula_descricao" TEXT,
    "aula_ordem" INTEGER NOT NULL,
    "aula_conteudo_texto" TEXT,
    "aula_url_video" TEXT,
    "aula_arquivo_slide" TEXT,
    "aula_arquivo_pdf" TEXT,
    "aula_material_complementar" TEXT,
    "aula_miniatura" TEXT,
    "aula_duracao_minutos" INTEGER,
    "aula_status_aula" TEXT DEFAULT 'publicada',
    "aula_criado_em" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "aula_atualizado_em" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "aula_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "curso" ("curso_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_usuario_cpf_key" ON "usuario"("usuario_cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_usuario_email_key" ON "usuario"("usuario_email");

-- CreateIndex
CREATE UNIQUE INDEX "instrutor_instrutor_numero_credencial_key" ON "instrutor"("instrutor_numero_credencial");

-- CreateIndex
CREATE UNIQUE INDEX "veiculo_veiculo_placa_key" ON "veiculo"("veiculo_placa");
