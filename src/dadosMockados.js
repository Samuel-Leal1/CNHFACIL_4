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

// 50 questões — 10 por tópico, respostas corretas variadas
export const questoes = [
    // ── LEGISLAÇÃO DE TRÂNSITO ──────────────────────────────────────────────
    {
        id: 1,
        theme: "Legislação de Trânsito",
        text: "De acordo com o CTB, o condutor que dirigir sob influência de álcool ou substância psicoativa comete infração:",
        options: [
            "Leve, com advertência por escrito.",
            "Média, apenas com multa.",
            "Grave, com retenção do veículo.",
            "Gravíssima, com multa e suspensão do direito de dirigir."
        ],
        correctAnswer: 3
    },
    {
        id: 2,
        theme: "Legislação de Trânsito",
        text: "A validade da CNH para condutores com menos de 50 anos é de:",
        options: [
            "3 anos.",
            "5 anos.",
            "8 anos.",
            "10 anos."
        ],
        correctAnswer: 3
    },
    {
        id: 3,
        theme: "Legislação de Trânsito",
        text: "Em um cruzamento sem sinalização, a preferência de passagem é:",
        options: [
            "Do veículo que estiver em maior velocidade.",
            "Do veículo que vier pela direita do condutor.",
            "Do veículo que for virar à esquerda.",
            "Do veículo de transporte coletivo, sempre."
        ],
        correctAnswer: 1
    },
    {
        id: 4,
        theme: "Legislação de Trânsito",
        text: "O cinto de segurança é equipamento obrigatório para:",
        options: [
            "Apenas o condutor do veículo.",
            "Apenas os ocupantes dos bancos dianteiros.",
            "Todos os ocupantes do veículo, em todas as vias.",
            "Somente em rodovias estaduais e federais."
        ],
        correctAnswer: 2
    },
    {
        id: 5,
        theme: "Legislação de Trânsito",
        text: "É proibida a ultrapassagem quando a via apresentar:",
        options: [
            "Linha tracejada na faixa central.",
            "Linha contínua amarela na faixa central.",
            "Mais de duas faixas no mesmo sentido.",
            "Sinalização de via preferencial."
        ],
        correctAnswer: 1
    },
    {
        id: 6,
        theme: "Legislação de Trânsito",
        text: "O acostamento poderá ser utilizado para circulação de veículos:",
        options: [
            "Para ultrapassagem de veículos lentos.",
            "Quando o tráfego estiver congestionado.",
            "Em situações de emergência ou quando sinalizado.",
            "Apenas para motocicletas."
        ],
        correctAnswer: 2
    },
    {
        id: 7,
        theme: "Legislação de Trânsito",
        text: "A luz amarela intermitente em um semáforo indica que o condutor deve:",
        options: [
            "Parar imediatamente o veículo antes da faixa.",
            "Acelerar para cruzar antes que feche.",
            "Reduzir a velocidade e cruzar com máxima atenção.",
            "Aguardar a luz verde para prosseguir."
        ],
        correctAnswer: 2
    },
    {
        id: 8,
        theme: "Legislação de Trânsito",
        text: "Estacionar sobre a calçada configura infração classificada como:",
        options: [
            "Leve.",
            "Média.",
            "Grave.",
            "Gravíssima."
        ],
        correctAnswer: 2
    },
    {
        id: 9,
        theme: "Legislação de Trânsito",
        text: "Qual documento NÃO é exigido para a habilitação na categoria B?",
        options: [
            "Carteira de identidade ou equivalente.",
            "CPF.",
            "Comprovante de conclusão do ensino médio.",
            "Exame médico e psicotécnico."
        ],
        correctAnswer: 2
    },
    {
        id: 10,
        theme: "Legislação de Trânsito",
        text: "A velocidade máxima permitida em vias urbanas de pista dupla, quando não houver sinalização indicando outra, é:",
        options: [
            "40 km/h.",
            "50 km/h.",
            "60 km/h.",
            "80 km/h."
        ],
        correctAnswer: 2
    },

    // ── DIREÇÃO DEFENSIVA ───────────────────────────────────────────────────
    {
        id: 11,
        theme: "Direção Defensiva",
        text: "A 'Regra dos 2 Segundos' é usada para determinar:",
        options: [
            "O tempo máximo permitido ao usar o celular.",
            "A distância mínima de seguimento seguro em relação ao veículo da frente.",
            "O tempo de reação após acionar o freio.",
            "O intervalo obrigatório entre ultrapassagens."
        ],
        correctAnswer: 1
    },
    {
        id: 12,
        theme: "Direção Defensiva",
        text: "Ao dirigir sob chuva intensa, o condutor deve:",
        options: [
            "Manter a velocidade normal para não atrasar o trânsito.",
            "Acender apenas o pisca-alerta e manter a velocidade.",
            "Reduzir a velocidade, aumentar a distância e acender os faróis baixos.",
            "Usar somente o freio de mão para controlar a velocidade."
        ],
        correctAnswer: 2
    },
    {
        id: 13,
        theme: "Direção Defensiva",
        text: "Usar o telefone celular sem dispositivo viva-voz ou fone de ouvido durante a condução é:",
        options: [
            "Permitido se a conversa for breve.",
            "Infração leve, sem pontos na carteira.",
            "Infração gravíssima, com multa e suspensão.",
            "Proibido apenas em rodovias."
        ],
        correctAnswer: 2
    },
    {
        id: 14,
        theme: "Direção Defensiva",
        text: "O fenômeno de aquaplanagem ocorre quando:",
        options: [
            "O motor superaquece em subidas longas.",
            "O freio trava em pista seca e o veículo derrapa.",
            "A camada de água entre o pneu e o asfalto faz o pneu perder aderência.",
            "O veículo desvia para o lado por causa do vento lateral."
        ],
        correctAnswer: 2
    },
    {
        id: 15,
        theme: "Direção Defensiva",
        text: "Dirigir com sono é perigoso porque:",
        options: [
            "Aumenta o consumo de combustível.",
            "Reduz o tempo de reação e pode causar lapsos de atenção.",
            "Causa superaquecimento do motor.",
            "Desgasta mais os pneus."
        ],
        correctAnswer: 1
    },
    {
        id: 16,
        theme: "Direção Defensiva",
        text: "Para realizar uma ultrapassagem segura, o condutor deve:",
        options: [
            "Buzinar intensamente e acelerar ao máximo.",
            "Verificar o espelho, sinalizar, conferir o ponto cego e completar a manobra com segurança.",
            "Usar apenas o espelho retrovisor interno.",
            "Reduzir a velocidade e aguardar o veículo à frente parar."
        ],
        correctAnswer: 1
    },
    {
        id: 17,
        theme: "Direção Defensiva",
        text: "O uso de faróis baixos é obrigatório em rodovias:",
        options: [
            "Apenas à noite.",
            "Apenas em dias de chuva.",
            "A qualquer hora do dia, mesmo com boa visibilidade.",
            "Somente em túneis."
        ],
        correctAnswer: 2
    },
    {
        id: 18,
        theme: "Direção Defensiva",
        text: "Ao se aproximar de um cruzamento com visibilidade reduzida, o condutor deve:",
        options: [
            "Acelerar para cruzar rapidamente e evitar colisões.",
            "Buzinar constantemente e manter a velocidade.",
            "Reduzir a velocidade e estar preparado para parar.",
            "Ligar o pisca-alerta e continuar normalmente."
        ],
        correctAnswer: 2
    },
    {
        id: 19,
        theme: "Direção Defensiva",
        text: "Em uma curva pronunciada, o condutor deve frear:",
        options: [
            "Durante a curva, para controlar melhor o veículo.",
            "Antes da curva, para entrar em velocidade adequada.",
            "Somente após a curva, para manter a aceleração.",
            "Apenas se houver veículo à frente."
        ],
        correctAnswer: 1
    },
    {
        id: 20,
        theme: "Direção Defensiva",
        text: "Qual é a principal finalidade da direção defensiva?",
        options: [
            "Aumentar a velocidade média nas viagens.",
            "Evitar acidentes mesmo diante de falhas de terceiros ou condições adversas.",
            "Reduzir o consumo de combustível.",
            "Proteger o veículo contra danos mecânicos."
        ],
        correctAnswer: 1
    },

    // ── PRIMEIROS SOCORROS ──────────────────────────────────────────────────
    {
        id: 21,
        theme: "Primeiros Socorros",
        text: "Ao presenciar um acidente com vítima, a primeira medida correta é:",
        options: [
            "Remover a vítima do veículo imediatamente.",
            "Dar água à vítima para ela se recuperar.",
            "Sinalizar o local para evitar novos acidentes e acionar o socorro.",
            "Sair do local para não atrapalhar."
        ],
        correctAnswer: 2
    },
    {
        id: 22,
        theme: "Primeiros Socorros",
        text: "A posição lateral de segurança é indicada para vítimas:",
        options: [
            "Com parada cardíaca.",
            "Inconscientes que respiram normalmente, sem suspeita de lesão na coluna.",
            "Com fratura nos membros inferiores.",
            "Com hemorragia intensa no tórax."
        ],
        correctAnswer: 1
    },
    {
        id: 23,
        theme: "Primeiros Socorros",
        text: "Para conter uma hemorragia externa, a medida mais adequada é:",
        options: [
            "Lavar o ferimento com álcool e cobrir com curativo.",
            "Elevar o membro e aguardar parar sozinho.",
            "Aplicar pressão direta e firme sobre o local com pano limpo.",
            "Colocar torniquete imediatamente em qualquer ferimento."
        ],
        correctAnswer: 2
    },
    {
        id: 24,
        theme: "Primeiros Socorros",
        text: "A RCP (Ressuscitação Cardiopulmonar) deve ser iniciada quando a vítima:",
        options: [
            "Está consciente e com dor intensa.",
            "Apresenta fratura exposta.",
            "Não respira e não apresenta sinais de circulação.",
            "Está com febre alta e convulsionando."
        ],
        correctAnswer: 2
    },
    {
        id: 25,
        theme: "Primeiros Socorros",
        text: "Diante de suspeita de lesão na coluna vertebral, o socorrista deve:",
        options: [
            "Sentar a vítima para facilitar a respiração.",
            "Mover a vítima o mais rápido possível para local seguro.",
            "Manter a vítima imóvel e aguardar socorro especializado.",
            "Aplicar tala improvisada na coluna."
        ],
        correctAnswer: 2
    },
    {
        id: 26,
        theme: "Primeiros Socorros",
        text: "Em caso de queimadura leve por calor, a conduta correta é:",
        options: [
            "Aplicar manteiga ou pasta dental para aliviar a dor.",
            "Estourar as bolhas para liberar o líquido.",
            "Lavar a área com água corrente fria por 10 a 20 minutos.",
            "Cobrir com esparadrapo seco e não molhar."
        ],
        correctAnswer: 2
    },
    {
        id: 27,
        theme: "Primeiros Socorros",
        text: "O número de telefone do SAMU (Serviço de Atendimento Móvel de Urgência) é:",
        options: [
            "190",
            "192",
            "193",
            "197"
        ],
        correctAnswer: 1
    },
    {
        id: 28,
        theme: "Primeiros Socorros",
        text: "Em caso de engasgo em adulto consciente, a manobra de primeiros socorros recomendada é:",
        options: [
            "Dar água para ajudar a desengasgar.",
            "A manobra de Heimlich (compressões abdominais).",
            "Deitar a vítima e fazer respiração boca a boca.",
            "Aguardar o engasgo se resolver sozinho."
        ],
        correctAnswer: 1
    },
    {
        id: 29,
        theme: "Primeiros Socorros",
        text: "Ao encontrar vítima com objeto perfurante encravado no corpo, deve-se:",
        options: [
            "Remover o objeto imediatamente para limpar o ferimento.",
            "Girar o objeto para alargar o canal e facilitar a remoção.",
            "Não remover o objeto e imobilizá-lo no local.",
            "Cortar o objeto rente à pele."
        ],
        correctAnswer: 2
    },
    {
        id: 30,
        theme: "Primeiros Socorros",
        text: "A frequência correta de compressões torácicas na RCP em adultos é de:",
        options: [
            "30 a 50 compressões por minuto.",
            "60 a 80 compressões por minuto.",
            "100 a 120 compressões por minuto.",
            "Mais de 150 compressões por minuto."
        ],
        correctAnswer: 2
    },

    // ── MEIO AMBIENTE E CIDADANIA ───────────────────────────────────────────
    {
        id: 31,
        theme: "Meio Ambiente e Cidadania",
        text: "Emitir fumaça preta excessiva pelo escapamento é infração porque:",
        options: [
            "Prejudica apenas a visibilidade dos outros condutores.",
            "Causa poluição atmosférica, sendo proibida pelo CTB e pela legislação ambiental.",
            "Acontece apenas em veículos com mais de 20 anos.",
            "É permitida em rodovias durante o dia."
        ],
        correctAnswer: 1
    },
    {
        id: 32,
        theme: "Meio Ambiente e Cidadania",
        text: "O CONAMA (Conselho Nacional do Meio Ambiente) é responsável por:",
        options: [
            "Fiscalizar o trânsito nas cidades.",
            "Emitir carteiras de habilitação.",
            "Estabelecer normas de controle de emissão de poluentes por veículos.",
            "Regulamentar seguros automotivos obrigatórios."
        ],
        correctAnswer: 2
    },
    {
        id: 33,
        theme: "Meio Ambiente e Cidadania",
        text: "Emitir sons ou ruídos acima do nível permitido com o veículo é infração classificada como:",
        options: [
            "Leve.",
            "Média.",
            "Grave.",
            "Gravíssima."
        ],
        correctAnswer: 2
    },
    {
        id: 34,
        theme: "Meio Ambiente e Cidadania",
        text: "Qual prática contribui diretamente para reduzir a emissão de poluentes pelo veículo?",
        options: [
            "Deixar o motor ligado em longas paradas.",
            "Dirigir em alta rotação constantemente.",
            "Realizar revisões periódicas e calibrar os pneus corretamente.",
            "Usar combustível adulterado para aumentar a potência."
        ],
        correctAnswer: 2
    },
    {
        id: 35,
        theme: "Meio Ambiente e Cidadania",
        text: "O descarte correto de óleo lubrificante veicular usado deve ser feito:",
        options: [
            "Jogando em bueiros ou terrenos baldios.",
            "Em postos de coleta ou estabelecimentos especializados.",
            "Queimando em área aberta.",
            "Enterrando em local distante de rios."
        ],
        correctAnswer: 1
    },
    {
        id: 36,
        theme: "Meio Ambiente e Cidadania",
        text: "O Programa de Inspeção e Manutenção de Veículos em Uso (I/M) tem como objetivo principal:",
        options: [
            "Arrecadar impostos sobre veículos antigos.",
            "Reduzir a poluição atmosférica e melhorar a segurança veicular.",
            "Controlar o número de veículos em circulação.",
            "Fiscalizar a velocidade nas rodovias."
        ],
        correctAnswer: 1
    },
    {
        id: 37,
        theme: "Meio Ambiente e Cidadania",
        text: "Qual atitude demonstra responsabilidade e cidadania no trânsito?",
        options: [
            "Buzinar excessivamente para que outros se movam.",
            "Parar em fila dupla por ser apenas por um momento.",
            "Ceder a passagem ao pedestre na faixa de pedestres.",
            "Estacionar em vaga de idoso quando a fila for pequena."
        ],
        correctAnswer: 2
    },
    {
        id: 38,
        theme: "Meio Ambiente e Cidadania",
        text: "Em relação aos pedestres, o CTB determina que o condutor deve:",
        options: [
            "Ter sempre preferência de passagem em relação ao pedestre.",
            "Dar preferência ao pedestre na faixa e quando houver sinalização indicando.",
            "Buzinar para alertar o pedestre e seguir.",
            "Ignorar a faixa em vias com mais de duas faixas."
        ],
        correctAnswer: 1
    },
    {
        id: 39,
        theme: "Meio Ambiente e Cidadania",
        text: "O uso do transporte coletivo e de bicicletas contribui para o meio ambiente porque:",
        options: [
            "Aumenta a arrecadação de impostos municipais.",
            "Reduz o número de veículos em circulação e diminui a emissão de poluentes.",
            "Melhora a pavimentação das vias urbanas.",
            "Aumenta a velocidade média do trânsito."
        ],
        correctAnswer: 1
    },
    {
        id: 40,
        theme: "Meio Ambiente e Cidadania",
        text: "Jogar lixo pela janela do veículo enquanto trafega é:",
        options: [
            "Permitido em rodovias sem fiscalização.",
            "Infração leve, sem pontos na CNH.",
            "Infração média, com multa.",
            "Permitido somente em vias urbanas."
        ],
        correctAnswer: 2
    },

    // ── MECÂNICA BÁSICA ─────────────────────────────────────────────────────
    {
        id: 41,
        theme: "Mecânica Básica",
        text: "A finalidade principal do sistema de arrefecimento do motor é:",
        options: [
            "Aumentar a potência do motor em subidas longas.",
            "Manter a temperatura ideal de funcionamento do motor.",
            "Filtrar o ar que entra na cabine de passageiros.",
            "Controlar a emissão de gases pelo escapamento."
        ],
        correctAnswer: 1
    },
    {
        id: 42,
        theme: "Mecânica Básica",
        text: "Quando a luz de pressão de óleo acende no painel enquanto o veículo está em movimento, o condutor deve:",
        options: [
            "Continuar dirigindo até o próximo posto.",
            "Acelerar para circular o óleo e apagar a luz.",
            "Parar o veículo em local seguro e verificar o nível de óleo.",
            "Desligar o ar-condicionado para compensar."
        ],
        correctAnswer: 2
    },
    {
        id: 43,
        theme: "Mecânica Básica",
        text: "A calibragem correta dos pneus é importante porque influencia diretamente:",
        options: [
            "Apenas o design visual do veículo.",
            "A estabilidade, o consumo de combustível e o desgaste dos pneus.",
            "Somente o desempenho em estradas de terra.",
            "O funcionamento do sistema elétrico."
        ],
        correctAnswer: 1
    },
    {
        id: 44,
        theme: "Mecânica Básica",
        text: "O extintor de incêndio veicular deve ser verificado:",
        options: [
            "Apenas ao comprar o veículo.",
            "A cada 5 anos, independentemente do prazo de validade.",
            "Conforme o prazo de validade indicado e anualmente.",
            "Somente quando necessário."
        ],
        correctAnswer: 2
    },
    {
        id: 45,
        theme: "Mecânica Básica",
        text: "O desgaste irregular dos pneus, com desgaste maior em um dos lados, pode indicar:",
        options: [
            "Problema no sistema de injeção de combustível.",
            "Bateria fraca ou em fim de vida útil.",
            "Problemas de alinhamento ou suspensão.",
            "Falha no sistema elétrico do veículo."
        ],
        correctAnswer: 2
    },
    {
        id: 46,
        theme: "Mecânica Básica",
        text: "O sintoma mais comum de bateria do veículo descarregada é:",
        options: [
            "Superaquecimento do motor.",
            "Dificuldade ou falha completa ao dar a partida.",
            "Consumo excessivo de óleo.",
            "Pneus murchando rapidamente."
        ],
        correctAnswer: 1
    },
    {
        id: 47,
        theme: "Mecânica Básica",
        text: "O sistema de freios ABS (Antilock Braking System) tem como principal função:",
        options: [
            "Aumentar a velocidade de frenagem em pistas secas.",
            "Reduzir o consumo de combustível durante a frenagem.",
            "Evitar o travamento das rodas durante a frenagem brusca.",
            "Melhorar a tração do veículo em subidas."
        ],
        correctAnswer: 2
    },
    {
        id: 48,
        theme: "Mecânica Básica",
        text: "O filtro de ar do motor deve ser substituído:",
        options: [
            "Apenas quando o carro apresentar falhas graves.",
            "Conforme recomendação do fabricante no manual do veículo.",
            "Nunca, pois é peça permanente.",
            "Somente em viagens acima de 500 km."
        ],
        correctAnswer: 1
    },
    {
        id: 49,
        theme: "Mecânica Básica",
        text: "O fluido de freio deve ser trocado periodicamente porque:",
        options: [
            "Melhora a aparência interna do sistema de freios.",
            "É utilizado para lubrificar as pastilhas de freio.",
            "Absorve umidade com o tempo, reduzindo a eficiência da frenagem.",
            "Regula a temperatura do motor em frenagens longas."
        ],
        correctAnswer: 2
    },
    {
        id: 50,
        theme: "Mecânica Básica",
        text: "Em um veículo com câmbio manual, a embreagem tem como função principal:",
        options: [
            "Controlar a pressão dos freios.",
            "Transmitir ou interromper a força do motor para a caixa de câmbio.",
            "Regular a direção hidráulica.",
            "Acionar o sistema de arrefecimento em subidas."
        ],
        correctAnswer: 1
    },
];

export const aulas = [
    { id: 1, titulo: "Legislação de Trânsito", aulasConcluidas: 0, aulasTotais: 10, progresso: 0, icone: "fa-clipboard", cor: "#d97706" },
    { id: 2, titulo: "Direção Defensiva",      aulasConcluidas: 0, aulasTotais: 8,  progresso: 0, icone: "fa-shield-halved", cor: "#3b82f6" },
    { id: 3, titulo: "Noções de Mecânica",     aulasConcluidas: 0, aulasTotais: 6,  progresso: 0, icone: "fa-wrench", cor: "#94a3b8" },
    { id: 4, titulo: "Meio Ambiente",          aulasConcluidas: 0, aulasTotais: 5,  progresso: 0, icone: "fa-leaf", cor: "#22c55e" },
    { id: 5, titulo: "Primeiros Socorros",     aulasConcluidas: 0, aulasTotais: 5,  progresso: 0, icone: "fa-stethoscope", cor: "#8b5cf6" }
];

export const veiculos = [
    { id: 1, nome: "Chevrolet Onix 1.0 Turbo", categoria: "B", placa: "ABC-1B23", status: "Disponível", icone: "🚗" },
    { id: 2, nome: "Honda CG 160 Titan",        categoria: "A", placa: "MOT-7X89", status: "Disponível", icone: "🏍️" }
];

export const historicoSimulados = [];
