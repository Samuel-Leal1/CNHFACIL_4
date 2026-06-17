import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

export const usuarios = [
    {
        id: 1,
        nome: "Duda",
        email: "duda.aluno@email.com",
        senhaHash: bcrypt.hashSync("12345678", salt),
        cargo: "ALUNO",
        categoria: "B",
        descricao: "Estudante dedicada, com foco em concluir o processo de habilitação de forma rápida e segura. Frequência excelente nas aulas teóricas.",
        cpf: "123.456.789-00",
        dataNascimento: "15/04/2004",
        documentos: {
            exameMedico: "Concluído",
            psicotecnico: "Concluído",
            documentosLegais: "Pendente"
        },
        jornada: {
            matricula: { concluido: true, data: "10/01/2024" },
            cursoTeorico: { concluido: true, horas: 45 },
            exameTeorico: { concluido: true, nota: "28/30" },
            aulasPraticas: { emAndamento: true, horasConcluidas: 12, horasTotais: 20 },
            exameFinal: { concluido: false }
        },
        financeiro: {
            valorTotal: 2500.00,
            valorPago: 1500.00,
            faltaPagar: 1000.00,
            progressoPercent: 60,
            proximaParcela: "10/06/2026"
        }
    },
    {
        id: 2,
        nome: "Instrutor Carlos",
        email: "carlos.instrutor@email.com",
        senhaHash: bcrypt.hashSync("123456", salt),
        cargo: "INSTRUTOR"
    },
    {
        id: 3,
        nome: "Administrador CNHFácil",
        email: "admin@cnhfacil.com",
        senhaHash: bcrypt.hashSync("123456", salt),
        cargo: "ADMIN"
    }
];

export const questoes = [
    {
        id: 1,
        theme: "Legislação de Trânsito",
        text: "De acordo com o Código de Trânsito Brasileiro, o condutor que dirigir sob a influência de álcool ou de qualquer outra substância psychoativa que determine dependência comete infração:",
        options: [
            "Gravíssima, com multa e suspensão do direito de dirigir.",
            "Grave, com multa e retenção do veículo.",
            "Média, com multa.",
            "Leve, apenas com advertência por escrito."
        ],
        correctAnswer: 0
    },
    {
        id: 2,
        theme: "Normas de Circulação",
        text: "Em um cruzamento sem sinalização, a preferência de passagem é:",
        options: [
            "Do veículo que estiver desenvolvendo maior velocidade.",
            "Do veículo que vier pela direita do condutor.",
            "Sempre do veículo que for virar à esquerda.",
            "Do veículo de transporte coletivo, independente da via."
        ],
        correctAnswer: 1
    },
    {
        id: 3,
        theme: "Sinalização",
        text: "A luz amarela intermitente em um semáforo de trânsito significa que o condutor deve:",
        options: [
            "Acelerar para passar rapidamente pelo cruzamento.",
            "Parar imediatamente o veículo na via.",
            "Reduzir a velocidade e cruzar a via com máxima atenção.",
            "Buzinar para alertar os outros condutores e seguir."
        ],
        correctAnswer: 2
    },
    {
        id: 4,
        theme: "Direção Defensiva",
        text: "Qual é a distância recomendada que o condutor deve manter do veículo que segue à frente para evitar colisões em caso de freada brusca?",
        options: [
            "A distância de seguimento segura (Regra dos 2 segundos).",
            "Aproximadamente 1 metro de distância.",
            "O suficiente para ler a placa do veículo da frente.",
            "Nenhuma distância específica, desde que o freio esteja bom."
        ],
        correctAnswer: 0
    },
    {
        id: 5,
        theme: "Primeiros Socorros",
        text: "Ao presenciar um acidente de trânsito com vítima, a primeira atitude correta a ser tomada é:",
        options: [
            "Remover as vítimas de dentro do veículo imediatamente.",
            "Dar água para as vítimas se acalmarem.",
            "Sinalizar o local para evitar novos acidentes e chamar o socorro.",
            "Sair do local rapidamente para não causar engarrafamento."
        ],
        correctAnswer: 2
    },
    {
        id: 6,
        theme: "Mecânica Básica",
        text: "A finalidade do sistema de arrefecimento do motor é:",
        options: [
            "Aumentar a potência do motor em subidas.",
            "Manter a temperatura ideal de funcionamento do motor.",
            "Filtrar o ar que entra na cabine de passageiros.",
            "Controlar a emissão de gases poluentes pelo escapamento."
        ],
        correctAnswer: 1
    },
    {
        id: 7,
        theme: "Meio Ambiente e Cidadania",
        text: "Emitir ruídos ou sons em níveis superiores aos fixados pelo CONAMA é considerado:",
        options: [
            "Infração grave, passível de multa e retenção do veículo.",
            "Apenas uma advertência verbal da autoridade.",
            "Permitido apenas durante os finais de semana.",
            "Infração leve, sem pontuação na CNH."
        ],
        correctAnswer: 0
    },
    {
        id: 8,
        theme: "Legislação de Trânsito",
        text: "A validade máxima da CNH (Carteira Nacional de Habilitação) para condutores com idade inferior a 50 anos é de:",
        options: [
            "3 anos.",
            "5 anos.",
            "10 anos.",
            "Vitalícia."
        ],
        correctAnswer: 2
    },
    {
        id: 9,
        theme: "Normas de Circulação",
        text: "O cinto de segurança é equipamento obrigatório para:",
        options: [
            "Apenas para o condutor do veículo.",
            "Apenas para os ocupantes dos bancos dianteiros.",
            "Todos os ocupantes do veículo, em todas as vias.",
            "Somente em rodovias estaduais e federais."
        ],
        correctAnswer: 2
    },
    {
        id: 10,
        theme: "Sinalização",
        text: "Diante da placa de advertência que indica 'Pista Escorregadia', a atitude mais segura do condutor é:",
        options: [
            "Aumentar a velocidade para passar mais rápido pelo trecho.",
            "Frear bruscamente assim que avistar a placa.",
            "Reduzir a velocidade gradativamente e redobrar a atenção.",
            "Desligar o motor para economizar combustível."
        ],
        correctAnswer: 2
    }
];

export const aulas = [
    { id: 1, titulo: "Legislação de Trânsito", aulasConcluidas: 12, aulasTotais: 15, progresso: 80, icone: "fa-clipboard", cor: "#d97706" },
    { id: 2, titulo: "Direção Defensiva", aulasConcluidas: 6, aulasTotais: 10, progresso: 60, icone: "fa-shield-halved", cor: "#3b82f6" },
    { id: 3, titulo: "Noções de Mecânica", aulasConcluidas: 1, aulasTotais: 5, progresso: 20, icone: "fa-wrench", cor: "#94a3b8" },
    { id: 4, titulo: "Meio Ambiente e Cidadania", aulasConcluidas: 10, aulasTotais: 10, progresso: 100, icone: "fa-leaf", cor: "#22c55e" },
    { id: 5, titulo: "Primeiros Socorros", aulasConcluidas: 0, aulasTotais: 5, progresso: 0, icone: "fa-stethoscope", cor: "#8b5cf6" }
];

export const veiculos = [
    { id: 1, nome: "Chevrolet Onix 1.0 Turbo", categoria: "B", placa: "ABC-1B23", status: "Disponível", icone: "🚗" },
    { id: 2, nome: "Honda CG 160 Titan", categoria: "A", placa: "MOT-7X89", status: "Disponível", icone: "🏍️" }
];

export const historicoSimulados = [
    { id: 1, data: "01/05/2026", acertos: 22, total: 40, notaPercent: 55, categoria: "Geral" },
    { id: 2, data: "08/05/2026", acertos: 26, total: 40, notaPercent: 65, categoria: "Geral" },
    { id: 3, data: "15/05/2026", acertos: 28, total: 40, notaPercent: 70, categoria: "Geral" },
    { id: 4, data: "22/05/2026", acertos: 30, total: 40, notaPercent: 75, categoria: "Legislação de Trânsito" },
    { id: 5, data: "29/05/2026", acertos: 32, total: 40, notaPercent: 80, categoria: "Direção Defensiva" },
    { id: 6, data: "05/06/2026", acertos: 34, total: 40, notaPercent: 85, categoria: "Geral" }
];