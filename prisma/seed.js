import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── helpers ────────────────────────────────────────────────────────────────────

async function findOrCreateSimulado(titulo) {
    let sim = await prisma.simulado.findFirst({ where: { simulado_titulo: titulo } });
    if (!sim) {
        sim = await prisma.simulado.create({
            data: { simulado_titulo: titulo, simulado_nota_minima: 70 },
        });
    }
    return sim;
}

// ── questões por tópico ────────────────────────────────────────────────────────

const QUESTOES = {
    'Legislação de Trânsito': [
        {
            e: 'O condutor que dirigir sob influência de álcool ou substância psicoativa comete infração:',
            a: 'Leve, com advertência por escrito.',
            b: 'Média, apenas com multa simples.',
            c: 'Grave, com retenção do veículo.',
            d: 'Gravíssima, com multa e suspensão do direito de dirigir.',
            c_: 'd',
            cat: 'Legislação de Trânsito',
        },
        {
            e: 'A validade da CNH para condutores com menos de 50 anos é de:',
            a: '3 anos.',
            b: '5 anos.',
            c: '8 anos.',
            d: '10 anos.',
            c_: 'd',
            cat: 'Legislação de Trânsito',
        },
        {
            e: 'Em um cruzamento sem sinalização, a preferência de passagem é:',
            a: 'Do veículo que estiver em maior velocidade.',
            b: 'Do veículo que vier pela direita do condutor.',
            c: 'Do veículo que for virar à esquerda.',
            d: 'Do veículo de transporte coletivo, sempre.',
            c_: 'b',
            cat: 'Legislação de Trânsito',
        },
        {
            e: 'O cinto de segurança é equipamento obrigatório para:',
            a: 'Apenas o condutor do veículo.',
            b: 'Apenas os ocupantes dos bancos dianteiros.',
            c: 'Todos os ocupantes do veículo, em todas as vias.',
            d: 'Somente em rodovias estaduais e federais.',
            c_: 'c',
            cat: 'Legislação de Trânsito',
        },
        {
            e: 'É proibida a ultrapassagem quando a via apresentar:',
            a: 'Linha tracejada na faixa central.',
            b: 'Linha contínua amarela na faixa central.',
            c: 'Mais de duas faixas no mesmo sentido.',
            d: 'Sinalização de via preferencial.',
            c_: 'b',
            cat: 'Legislação de Trânsito',
        },
        {
            e: 'O acostamento poderá ser utilizado para circulação de veículos:',
            a: 'Para ultrapassagem de veículos lentos.',
            b: 'Quando o tráfego estiver congestionado.',
            c: 'Em situações de emergência ou quando sinalizado.',
            d: 'Apenas para motocicletas.',
            c_: 'c',
            cat: 'Legislação de Trânsito',
        },
        {
            e: 'A luz amarela intermitente em um semáforo indica que o condutor deve:',
            a: 'Parar imediatamente o veículo antes da faixa.',
            b: 'Acelerar para cruzar antes que feche.',
            c: 'Reduzir a velocidade e cruzar com máxima atenção.',
            d: 'Aguardar a luz verde para prosseguir.',
            c_: 'c',
            cat: 'Legislação de Trânsito',
        },
        {
            e: 'Estacionar sobre a calçada configura infração classificada como:',
            a: 'Leve.',
            b: 'Média.',
            c: 'Grave.',
            d: 'Gravíssima.',
            c_: 'c',
            cat: 'Legislação de Trânsito',
        },
        {
            e: 'Qual documento NÃO é exigido para a obtenção da habilitação na categoria B?',
            a: 'Carteira de identidade ou documento equivalente.',
            b: 'CPF.',
            c: 'Comprovante de conclusão do ensino médio.',
            d: 'Resultado de exame médico e psicotécnico.',
            c_: 'c',
            cat: 'Legislação de Trânsito',
        },
        {
            e: 'A velocidade máxima em vias urbanas de pista dupla, sem sinalização específica, é:',
            a: '40 km/h.',
            b: '50 km/h.',
            c: '60 km/h.',
            d: '80 km/h.',
            c_: 'c',
            cat: 'Legislação de Trânsito',
        },
    ],

    'Direção Defensiva': [
        {
            e: "A 'Regra dos 2 Segundos' é usada para determinar:",
            a: 'O tempo máximo permitido ao usar o celular.',
            b: 'A distância mínima de seguimento seguro em relação ao veículo da frente.',
            c: 'O tempo de reação após acionar o freio.',
            d: 'O intervalo obrigatório entre ultrapassagens.',
            c_: 'b',
            cat: 'Direção Defensiva',
        },
        {
            e: 'Ao dirigir sob chuva intensa, o condutor deve:',
            a: 'Manter a velocidade normal para não atrasar o trânsito.',
            b: 'Acender apenas o pisca-alerta e manter a velocidade.',
            c: 'Reduzir a velocidade, aumentar a distância e acender os faróis baixos.',
            d: 'Usar somente o freio de mão para controlar a velocidade.',
            c_: 'c',
            cat: 'Direção Defensiva',
        },
        {
            e: 'Usar o telefone celular sem dispositivo viva-voz durante a condução é:',
            a: 'Permitido se a conversa for breve.',
            b: 'Infração leve, sem pontos na carteira.',
            c: 'Infração gravíssima, com multa e suspensão.',
            d: 'Proibido apenas em rodovias.',
            c_: 'c',
            cat: 'Direção Defensiva',
        },
        {
            e: 'O fenômeno de aquaplanagem ocorre quando:',
            a: 'O motor superaquece em subidas longas.',
            b: 'O freio trava em pista seca e o veículo derrapa.',
            c: 'A camada de água entre o pneu e o asfalto faz o pneu perder aderência.',
            d: 'O veículo desvia para o lado por causa do vento lateral.',
            c_: 'c',
            cat: 'Direção Defensiva',
        },
        {
            e: 'Dirigir com sono é perigoso principalmente porque:',
            a: 'Aumenta o consumo de combustível.',
            b: 'Reduz o tempo de reação e pode causar lapsos de atenção.',
            c: 'Causa superaquecimento do motor.',
            d: 'Desgasta mais rapidamente os pneus.',
            c_: 'b',
            cat: 'Direção Defensiva',
        },
        {
            e: 'Para realizar uma ultrapassagem segura, o condutor deve:',
            a: 'Buzinar intensamente e acelerar ao máximo.',
            b: 'Verificar o espelho, sinalizar, conferir o ponto cego e completar a manobra com segurança.',
            c: 'Usar apenas o espelho retrovisor interno.',
            d: 'Reduzir a velocidade e aguardar o veículo à frente parar.',
            c_: 'b',
            cat: 'Direção Defensiva',
        },
        {
            e: 'O uso de faróis baixos é obrigatório em rodovias:',
            a: 'Apenas à noite.',
            b: 'Apenas em dias de chuva.',
            c: 'A qualquer hora do dia, mesmo com boa visibilidade.',
            d: 'Somente dentro de túneis.',
            c_: 'c',
            cat: 'Direção Defensiva',
        },
        {
            e: 'Ao se aproximar de um cruzamento com visibilidade reduzida, o condutor deve:',
            a: 'Acelerar para cruzar rapidamente e evitar colisões.',
            b: 'Buzinar constantemente e manter a velocidade.',
            c: 'Reduzir a velocidade e estar preparado para parar.',
            d: 'Ligar o pisca-alerta e continuar normalmente.',
            c_: 'c',
            cat: 'Direção Defensiva',
        },
        {
            e: 'Em uma curva pronunciada, o condutor deve frear:',
            a: 'Durante a curva, para controlar melhor o veículo.',
            b: 'Antes da curva, para entrar em velocidade adequada.',
            c: 'Somente após a curva, para manter a aceleração.',
            d: 'Apenas se houver veículo à frente.',
            c_: 'b',
            cat: 'Direção Defensiva',
        },
        {
            e: 'Qual é a principal finalidade da direção defensiva?',
            a: 'Aumentar a velocidade média nas viagens.',
            b: 'Reduzir o consumo de combustível.',
            c: 'Proteger o veículo contra danos mecânicos.',
            d: 'Evitar acidentes mesmo diante de falhas de terceiros ou condições adversas.',
            c_: 'd',
            cat: 'Direção Defensiva',
        },
    ],

    'Primeiros Socorros': [
        {
            e: 'Ao presenciar um acidente com vítima, a primeira medida correta é:',
            a: 'Remover a vítima do veículo imediatamente.',
            b: 'Dar água à vítima para ela se recuperar.',
            c: 'Sinalizar o local para evitar novos acidentes e acionar o socorro.',
            d: 'Sair do local para não atrapalhar.',
            c_: 'c',
            cat: 'Primeiros Socorros',
        },
        {
            e: 'A posição lateral de segurança é indicada para vítimas:',
            a: 'Com parada cardíaca.',
            b: 'Inconscientes que respiram normalmente, sem suspeita de lesão na coluna.',
            c: 'Com fratura nos membros inferiores.',
            d: 'Com hemorragia intensa no tórax.',
            c_: 'b',
            cat: 'Primeiros Socorros',
        },
        {
            e: 'Para conter uma hemorragia externa, a medida mais adequada é:',
            a: 'Lavar o ferimento com álcool e cobrir com curativo.',
            b: 'Elevar o membro e aguardar parar sozinho.',
            c: 'Aplicar pressão direta e firme sobre o local com pano limpo.',
            d: 'Colocar torniquete imediatamente em qualquer ferimento.',
            c_: 'c',
            cat: 'Primeiros Socorros',
        },
        {
            e: 'A RCP (Ressuscitação Cardiopulmonar) deve ser iniciada quando a vítima:',
            a: 'Está consciente e com dor intensa.',
            b: 'Apresenta fratura exposta.',
            c: 'Não respira e não apresenta sinais de circulação.',
            d: 'Está com febre alta e convulsionando.',
            c_: 'c',
            cat: 'Primeiros Socorros',
        },
        {
            e: 'Diante de suspeita de lesão na coluna vertebral, o socorrista deve:',
            a: 'Sentar a vítima para facilitar a respiração.',
            b: 'Mover a vítima o mais rápido possível para local seguro.',
            c: 'Manter a vítima imóvel e aguardar socorro especializado.',
            d: 'Aplicar tala improvisada na coluna.',
            c_: 'c',
            cat: 'Primeiros Socorros',
        },
        {
            e: 'Em caso de queimadura leve por calor, a conduta correta é:',
            a: 'Aplicar manteiga ou pasta dental para aliviar a dor.',
            b: 'Estourar as bolhas para liberar o líquido.',
            c: 'Lavar a área com água corrente fria por 10 a 20 minutos.',
            d: 'Cobrir com esparadrapo seco e não molhar.',
            c_: 'c',
            cat: 'Primeiros Socorros',
        },
        {
            e: 'O número de telefone do SAMU (Serviço de Atendimento Móvel de Urgência) é:',
            a: '190',
            b: '192',
            c: '193',
            d: '197',
            c_: 'b',
            cat: 'Primeiros Socorros',
        },
        {
            e: 'Em caso de engasgo em adulto consciente, a manobra recomendada é:',
            a: 'Dar água para ajudar a desengasgar.',
            b: 'A manobra de Heimlich (compressões abdominais).',
            c: 'Deitar a vítima e fazer respiração boca a boca.',
            d: 'Aguardar o engasgo se resolver sozinho.',
            c_: 'b',
            cat: 'Primeiros Socorros',
        },
        {
            e: 'Ao encontrar vítima com objeto perfurante encravado no corpo, deve-se:',
            a: 'Remover o objeto imediatamente para limpar o ferimento.',
            b: 'Girar o objeto para alargar o canal e facilitar a remoção.',
            c: 'Não remover o objeto e imobilizá-lo no local.',
            d: 'Cortar o objeto rente à pele.',
            c_: 'c',
            cat: 'Primeiros Socorros',
        },
        {
            e: 'A frequência correta de compressões torácicas na RCP em adultos é de:',
            a: '30 a 50 compressões por minuto.',
            b: '60 a 80 compressões por minuto.',
            c: '100 a 120 compressões por minuto.',
            d: 'Mais de 150 compressões por minuto.',
            c_: 'c',
            cat: 'Primeiros Socorros',
        },
    ],

    'Meio Ambiente e Cidadania': [
        {
            e: 'Emitir fumaça preta excessiva pelo escapamento é infração porque:',
            a: 'Prejudica apenas a visibilidade dos outros condutores.',
            b: 'Causa poluição atmosférica, sendo proibida pelo CTB e pela legislação ambiental.',
            c: 'Acontece apenas em veículos com mais de 20 anos.',
            d: 'É permitida em rodovias durante o dia.',
            c_: 'b',
            cat: 'Meio Ambiente e Cidadania',
        },
        {
            e: 'O CONAMA é responsável por:',
            a: 'Fiscalizar o trânsito nas cidades.',
            b: 'Emitir carteiras de habilitação.',
            c: 'Estabelecer normas de controle de emissão de poluentes por veículos.',
            d: 'Regulamentar seguros automotivos obrigatórios.',
            c_: 'c',
            cat: 'Meio Ambiente e Cidadania',
        },
        {
            e: 'Emitir sons ou ruídos acima do nível permitido com o veículo é infração classificada como:',
            a: 'Leve.',
            b: 'Média.',
            c: 'Grave.',
            d: 'Gravíssima.',
            c_: 'c',
            cat: 'Meio Ambiente e Cidadania',
        },
        {
            e: 'Qual prática contribui diretamente para reduzir a emissão de poluentes pelo veículo?',
            a: 'Deixar o motor ligado em longas paradas.',
            b: 'Dirigir em alta rotação constantemente.',
            c: 'Realizar revisões periódicas e calibrar os pneus corretamente.',
            d: 'Usar combustível adulterado para aumentar a potência.',
            c_: 'c',
            cat: 'Meio Ambiente e Cidadania',
        },
        {
            e: 'O descarte correto de óleo lubrificante veicular usado deve ser feito:',
            a: 'Jogando em bueiros ou terrenos baldios.',
            b: 'Em postos de coleta ou estabelecimentos especializados.',
            c: 'Queimando em área aberta.',
            d: 'Enterrando em local distante de rios.',
            c_: 'b',
            cat: 'Meio Ambiente e Cidadania',
        },
        {
            e: 'O Programa de Inspeção e Manutenção de Veículos em Uso (I/M) tem como objetivo principal:',
            a: 'Arrecadar impostos sobre veículos antigos.',
            b: 'Reduzir a poluição atmosférica e melhorar a segurança veicular.',
            c: 'Controlar o número de veículos em circulação.',
            d: 'Fiscalizar a velocidade nas rodovias.',
            c_: 'b',
            cat: 'Meio Ambiente e Cidadania',
        },
        {
            e: 'Qual atitude demonstra responsabilidade e cidadania no trânsito?',
            a: 'Buzinar excessivamente para que outros se movam.',
            b: 'Parar em fila dupla quando for apenas por um momento.',
            c: 'Ceder a passagem ao pedestre na faixa de pedestres.',
            d: 'Estacionar em vaga de idoso quando a fila for pequena.',
            c_: 'c',
            cat: 'Meio Ambiente e Cidadania',
        },
        {
            e: 'Em relação aos pedestres, o CTB determina que o condutor deve:',
            a: 'Ter sempre preferência de passagem em relação ao pedestre.',
            b: 'Dar preferência ao pedestre na faixa e quando houver sinalização indicando.',
            c: 'Buzinar para alertar o pedestre e seguir.',
            d: 'Ignorar a faixa em vias com mais de duas faixas.',
            c_: 'b',
            cat: 'Meio Ambiente e Cidadania',
        },
        {
            e: 'O uso de transporte coletivo e de bicicletas contribui para o meio ambiente porque:',
            a: 'Aumenta a arrecadação de impostos municipais.',
            b: 'Reduz o número de veículos em circulação e diminui a emissão de poluentes.',
            c: 'Melhora a pavimentação das vias urbanas.',
            d: 'Aumenta a velocidade média do trânsito.',
            c_: 'b',
            cat: 'Meio Ambiente e Cidadania',
        },
        {
            e: 'Jogar lixo pela janela do veículo enquanto trafega é:',
            a: 'Permitido em rodovias sem fiscalização.',
            b: 'Infração leve, sem pontos na CNH.',
            c: 'Infração média, com multa.',
            d: 'Permitido somente em vias urbanas.',
            c_: 'c',
            cat: 'Meio Ambiente e Cidadania',
        },
    ],

    'Mecânica Básica': [
        {
            e: 'A finalidade principal do sistema de arrefecimento do motor é:',
            a: 'Aumentar a potência do motor em subidas longas.',
            b: 'Manter a temperatura ideal de funcionamento do motor.',
            c: 'Filtrar o ar que entra na cabine de passageiros.',
            d: 'Controlar a emissão de gases pelo escapamento.',
            c_: 'b',
            cat: 'Mecânica Básica',
        },
        {
            e: 'Quando a luz de pressão de óleo acende no painel, o condutor deve:',
            a: 'Continuar dirigindo até o próximo posto.',
            b: 'Acelerar para circular o óleo e apagar a luz.',
            c: 'Parar o veículo em local seguro e verificar o nível de óleo.',
            d: 'Desligar o ar-condicionado para compensar.',
            c_: 'c',
            cat: 'Mecânica Básica',
        },
        {
            e: 'A calibragem correta dos pneus influencia diretamente:',
            a: 'Apenas o design visual do veículo.',
            b: 'A estabilidade, o consumo de combustível e o desgaste dos pneus.',
            c: 'Somente o desempenho em estradas de terra.',
            d: 'O funcionamento do sistema elétrico.',
            c_: 'b',
            cat: 'Mecânica Básica',
        },
        {
            e: 'O extintor de incêndio veicular deve ser verificado:',
            a: 'Apenas ao comprar o veículo.',
            b: 'A cada 5 anos, independentemente do prazo de validade.',
            c: 'Conforme o prazo de validade indicado e anualmente.',
            d: 'Somente quando necessário.',
            c_: 'c',
            cat: 'Mecânica Básica',
        },
        {
            e: 'O desgaste irregular dos pneus, com desgaste maior em um dos lados, pode indicar:',
            a: 'Problema no sistema de injeção de combustível.',
            b: 'Bateria fraca ou em fim de vida útil.',
            c: 'Problemas de alinhamento ou suspensão.',
            d: 'Falha no sistema elétrico do veículo.',
            c_: 'c',
            cat: 'Mecânica Básica',
        },
        {
            e: 'O sintoma mais comum de bateria do veículo descarregada é:',
            a: 'Superaquecimento do motor.',
            b: 'Dificuldade ou falha completa ao dar a partida.',
            c: 'Consumo excessivo de óleo.',
            d: 'Pneus murchando rapidamente.',
            c_: 'b',
            cat: 'Mecânica Básica',
        },
        {
            e: 'O sistema de freios ABS tem como principal função:',
            a: 'Aumentar a velocidade de frenagem em pistas secas.',
            b: 'Reduzir o consumo de combustível durante a frenagem.',
            c: 'Evitar o travamento das rodas durante a frenagem brusca.',
            d: 'Melhorar a tração do veículo em subidas.',
            c_: 'c',
            cat: 'Mecânica Básica',
        },
        {
            e: 'O filtro de ar do motor deve ser substituído:',
            a: 'Apenas quando o carro apresentar falhas graves.',
            b: 'Conforme recomendação do fabricante no manual do veículo.',
            c: 'Nunca, pois é peça permanente.',
            d: 'Somente em viagens acima de 500 km.',
            c_: 'b',
            cat: 'Mecânica Básica',
        },
        {
            e: 'O fluido de freio deve ser trocado periodicamente porque:',
            a: 'Melhora a aparência interna do sistema de freios.',
            b: 'É utilizado para lubrificar as pastilhas de freio.',
            c: 'Absorve umidade com o tempo, reduzindo a eficiência da frenagem.',
            d: 'Regula a temperatura do motor em frenagens longas.',
            c_: 'c',
            cat: 'Mecânica Básica',
        },
        {
            e: 'Em um veículo com câmbio manual, a embreagem tem como função principal:',
            a: 'Controlar a pressão dos freios.',
            b: 'Transmitir ou interromper a força do motor para a caixa de câmbio.',
            c: 'Regular a direção hidráulica.',
            d: 'Acionar o sistema de arrefecimento em subidas.',
            c_: 'b',
            cat: 'Mecânica Básica',
        },
    ],
};

// ── main ───────────────────────────────────────────────────────────────────────

async function main() {
    // ── Usuários ──────────────────────────────────────────────────────────────
    const salt = await bcrypt.genSalt(10);
    const senhaHashAdmin = await bcrypt.hash('admin123', salt);
    const senhaHashAluno = await bcrypt.hash('aluno123', salt);

    await prisma.usuario.upsert({
        where: { usuario_email: 'admin@cnhfacil.com' },
        update: {
            usuario_nome: 'Administrador CNHFácil',
            usuario_cpf: '00000000001',
            usuario_senha: senhaHashAdmin,
            usuario_nivel_acesso: 'admin',
        },
        create: {
            usuario_nome: 'Administrador CNHFácil',
            usuario_cpf: '00000000001',
            usuario_email: 'admin@cnhfacil.com',
            usuario_senha: senhaHashAdmin,
            usuario_nivel_acesso: 'admin',
        },
    });

    await prisma.usuario.upsert({
        where: { usuario_email: 'aluno@cnhfacil.com' },
        update: {
            usuario_nome: 'Aluno CNHFácil',
            usuario_cpf: '00000000002',
            usuario_senha: senhaHashAluno,
            usuario_nivel_acesso: 'aluno',
        },
        create: {
            usuario_nome: 'Aluno CNHFácil',
            usuario_cpf: '00000000002',
            usuario_email: 'aluno@cnhfacil.com',
            usuario_senha: senhaHashAluno,
            usuario_nivel_acesso: 'aluno',
        },
    });

    console.log('✓ Usuários seedados');

    // ── Simulados + Questões ──────────────────────────────────────────────────
    for (const [titulo, questoes] of Object.entries(QUESTOES)) {
        const simulado = await findOrCreateSimulado(titulo);

        // Remove questões antigas deste simulado (idempotente)
        await prisma.questao.deleteMany({ where: { simulado_id: simulado.simulado_id } });

        // Insere as 10 novas questões
        await prisma.questao.createMany({
            data: questoes.map(q => ({
                simulado_id: simulado.simulado_id,
                questao_enunciado:     q.e,
                questao_alternativa_a: q.a,
                questao_alternativa_b: q.b,
                questao_alternativa_c: q.c,
                questao_alternativa_d: q.d,
                questao_letra_correta: q.c_,
                questao_categoria:     q.cat,
            })),
        });

        console.log(`✓ ${questoes.length} questões seedadas para "${titulo}"`);
    }

    console.log('\n✅ Seed concluído — 50 questões no banco.');

    // ── Cursos + Aulas ────────────────────────────────────────────────────────
    const CURSOS = [
        {
            titulo: 'Legislação de Trânsito',
            cargaHoraria: 10,
            aulas: [
                {
                    titulo: 'Introdução ao Código de Trânsito Brasileiro',
                    descricao: 'Conheça os fundamentos do CTB e como ele organiza o trânsito no Brasil.',
                    ordem: 1, duracao: 12,
                    videoUrl: 'https://www.youtube.com/embed/p2_6Ea_XN_4',
                    conteudo: null,
                },
                {
                    titulo: 'Infrações e Penalidades',
                    descricao: 'As quatro categorias de infração e seus impactos na CNH.',
                    ordem: 2, duracao: 10,
                    videoUrl: null,
                    conteudo: `### Classificação das Infrações
O Código de Trânsito Brasileiro classifica as infrações em quatro tipos, de acordo com a gravidade:

• Leve — 3 pontos na CNH (ex.: não usar cinto de segurança).
• Média — 4 pontos (ex.: trafegar na contramão em via de mão única).
• Grave — 5 pontos (ex.: avançar sinal vermelho).
• Gravíssima — 7 pontos, com multa multiplicada por 3, 5 ou 10 vezes (ex.: dirigir sob influência de álcool).

### Suspensão e Cassação
Ao acumular 20 pontos em 12 meses, a CNH é suspensa por 6 meses. A cassação ocorre quando o condutor reincide na suspensão dentro de 12 meses, ou pratica infrações gravíssimas como homicídio doloso ao volante.

### Recurso de Multas
Todo condutor pode recorrer de uma multa. O primeiro recurso é dirigido ao órgão autuador (DETRAN, PRF etc.), o segundo à JARI (Junta Administrativa de Recursos de Infrações) e o terceiro ao CETRAN (Conselho Estadual de Trânsito).

### Pontuação Especial
Condutores com CNH há mais de 1 ano e sem infrações graves nos últimos 12 meses têm limite de 40 pontos antes da suspensão. Com infrações médias no período, o limite é 30 pontos.`,
                },
                {
                    titulo: 'Sinalizações de Trânsito',
                    descricao: 'Placas, semáforos, marcas viárias e a hierarquia entre eles.',
                    ordem: 3, duracao: 9,
                    videoUrl: null,
                    conteudo: `### Hierarquia da Sinalização
Quando há conflito entre tipos de sinalização, a ordem de prevalência é:
1. Agente de trânsito (guarda, policial) — prevalece sobre tudo.
2. Semáforos.
3. Placas de regulamentação.
4. Marcas viárias (pinturas no asfalto).

### Placas de Regulamentação (R)
Fundo branco com borda vermelha. Indicam proibições ou obrigações. Exemplos: R-1 (Pare), R-2 (Dê a preferência), R-19 (Velocidade máxima permitida).

### Placas de Advertência (A)
Fundo amarelo, losangular. Alertam sobre condições perigosas à frente: curvas, cruzamentos, passagens de nível, escolares etc.

### Placas de Indicação (I)
Fornecem informações sobre destinos, distâncias e serviços. Podem ter fundo verde (rodovias), azul (serviços) ou marrom (turismo).

### Marcas Viárias
• Linha branca contínua: proibido ultrapassar.
• Linha branca tracejada: ultrapassagem permitida.
• Linha amarela dupla contínua: proibição nos dois sentidos.
• Faixa de pedestres: obrigação de dar preferência ao pedestre.`,
                },
                {
                    titulo: 'Normas de Circulação e Velocidade',
                    descricao: 'Limites de velocidade, distância segura e regras de circulação.',
                    ordem: 4, duracao: 11,
                    videoUrl: null,
                    conteudo: `### Limites de Velocidade (CTB, art. 61)
Quando não houver sinalização específica, os limites são:
• Vias urbanas de trânsito rápido: 80 km/h.
• Vias urbanas de pista dupla: 60 km/h.
• Vias urbanas de pista simples: 40 km/h.
• Rodovias federais e estaduais (veículos de passeio): 110 km/h.
• Rodovias municipais: 60 km/h.

### Ultrapassagem
Só é permitida quando a via apresentar linha tracejada na faixa central, a visibilidade for suficiente e não houver veículo vindo no sentido contrário. É proibida próximo a curvas, cruzamentos, viadutos e em vias de mão única.

### Cruzamentos sem Sinalização
A preferência cabe ao veículo que vem pela direita do condutor. Em vias de diferentes categorias, prevalece a via de maior fluxo.

### Distância de Segurança
O CTB não define um valor fixo, mas o condutor deve manter distância suficiente para frear com segurança. A técnica dos 2 segundos é amplamente utilizada: escolha um ponto fixo; quando o veículo à frente o passar, você deve ter pelo menos 2 segundos para chegar ao mesmo ponto.`,
                },
                {
                    titulo: 'Habilitação e Documentação',
                    descricao: 'Requisitos para obter a CNH e documentos obrigatórios para conduzir.',
                    ordem: 5, duracao: 8,
                    videoUrl: null,
                    conteudo: `### Processo de Habilitação (categoria B)
1. Abertura de processo no DETRAN com documentação (RG, CPF, comprovante de residência).
2. Exame médico — avalia acuidade visual, audição e condições gerais de saúde.
3. Exame psicotécnico — avalia capacidade de atenção, coordenação e equilíbrio emocional.
4. Aulas teóricas — mínimo de 45 horas em auto escola credenciada.
5. Exame teórico — 30 questões, aprovação com acerto de 21 ou mais (70%).
6. Aulas práticas — mínimo de 20 horas no veículo com instrutor.
7. Exame prático — realizado por examinador do DETRAN em percurso predefinido.

### Validade da CNH
• Até 49 anos: renovação a cada 10 anos.
• De 50 a 59 anos: renovação a cada 5 anos.
• De 60 a 69 anos: renovação a cada 3 anos.
• 70 anos ou mais: renovação a cada 1 ano.

### Documentos Obrigatórios ao Conduzir
• CNH ou Permissão para Dirigir (PPD) dentro da validade.
• CRLV (Certificado de Registro e Licenciamento do Veículo) do ano vigente.
• Seguro DPVAT (obrigatório, incluso no licenciamento).
Circular sem esses documentos sujeita o condutor à retenção do veículo e multa grave.`,
                },
            ],
        },

        {
            titulo: 'Direção Defensiva',
            cargaHoraria: 8,
            aulas: [
                {
                    titulo: 'O que é Direção Defensiva',
                    descricao: 'Princípios e atitude para evitar acidentes mesmo diante de falhas alheias.',
                    ordem: 1, duracao: 14,
                    videoUrl: 'https://www.youtube.com/embed/KsB1LdLdJgA',
                    conteudo: null,
                },
                {
                    titulo: 'Fatores de Risco no Trânsito',
                    descricao: 'Os principais perigos que o condutor enfrenta no dia a dia.',
                    ordem: 2, duracao: 9,
                    videoUrl: null,
                    conteudo: `### Os Quatro Fatores de Risco
O CTB e a literatura de segurança viária identificam quatro categorias de fatores que contribuem para acidentes:

1. Fator humano — responsável por mais de 90% dos acidentes. Inclui desatenção, excesso de velocidade, uso de álcool, sono, uso de celular e imprudência.
2. Fator veículo — falhas mecânicas como pneus carecas, freios desgastados, faróis com defeito.
3. Fator via — pista esburacada, sinalização inexistente ou inadequada, cruzamentos perigosos.
4. Fator ambiente — chuva, neblina, vento lateral, ofuscamento pelo sol.

### Álcool e Direção
A Lei Seca (Lei 11.705/2008) proíbe qualquer concentração de álcool no sangue ao volante. O motorista que apresentar 0,05 mg/L ou mais de álcool no ar expirado comete infração gravíssima (multa de R$ 2.934,70 e suspensão da CNH por 12 meses). Acima de 0,3 mg/L, a conduta é considerada crime de trânsito, com pena de 6 meses a 3 anos de prisão.

### Uso do Celular
Segurar ou manusear o celular ao volante é infração gravíssima: multa de R$ 293,47 e 7 pontos na CNH. A atenção se divide drasticamente ao usar o telefone, aumentando o tempo de reação em até 50%.

### Fadiga e Sono
O sono reduz o tempo de reação tanto quanto o álcool. Em rodovias, o CTB obriga parada a cada 4 horas de direção contínua, com descanso mínimo de 30 minutos. Sinais de sonolência ao volante pedem parada imediata em local seguro.`,
                },
                {
                    titulo: 'Distância de Segurança e Frenagem',
                    descricao: 'Como calcular e manter a distância correta do veículo à frente.',
                    ordem: 3, duracao: 8,
                    videoUrl: null,
                    conteudo: `### Distância de Segurança
A distância de segurança é o espaço mínimo necessário para que o condutor possa frear sem colidir com o veículo à frente. Ela depende de:
• Velocidade — quanto maior a velocidade, maior o espaço necessário.
• Tempo de reação — em média 0,8 a 1 segundo para o condutor descansado.
• Condição do asfalto — pista molhada aumenta a distância de frenagem em até 3 vezes.
• Estado dos freios e pneus — componentes desgastados reduzem a eficiência de frenagem.

### Regra dos 2 Segundos
Escolha um ponto fixo na pista (placa, poste). Quando o veículo à frente o passar, conte "1001... 1002". Você deve chegar ao mesmo ponto somente após terminar a contagem. Em condições adversas (chuva, neblina), use a regra dos 4 segundos.

### Aquaplanagem
Ocorre quando uma camada de água se forma entre o pneu e o asfalto, fazendo o veículo perder aderência. Para evitar: reduza a velocidade antes de entrar em poças, calibre os pneus corretamente e evite frenagem brusca em pista molhada. Se ocorrer, solte o acelerador gradualmente e mantenha o volante reto — não freie de repente.

### Distância de Frenagem por Velocidade
• 50 km/h: ~14 m de distância de frenagem (condições ideais).
• 80 km/h: ~36 m.
• 110 km/h: ~69 m.
Esses valores dobram em pista molhada.`,
                },
                {
                    titulo: 'Dirigindo em Condições Adversas',
                    descricao: 'Chuva, neblina, noite e outras situações que exigem redobrada atenção.',
                    ordem: 4, duracao: 10,
                    videoUrl: null,
                    conteudo: `### Chuva Intensa
• Reduza a velocidade em pelo menos 20% em relação ao limite da via.
• Acenda os faróis baixos (mesmo de dia) — nunca use apenas o pisca-alerta em movimento.
• Aumente a distância do veículo à frente.
• Evite frenagem brusca e manobras rápidas.
• Cuidado com canaletas e buracos cobertos de água.

### Neblina e Cerração
• Use faróis de neblina (milha) se o veículo os possuir, ou faróis baixos.
• Reduza drasticamente a velocidade — a visibilidade pode ser de poucos metros.
• Nunca use faróis altos: a luz reflete nas partículas de água e piora a visibilidade.
• Mantenha-se na faixa com o auxílio das marcas do acostamento.

### Direção Noturna
• Acenda os faróis ao entardecer e mantenha-os até o amanhecer.
• Use o farol alto apenas em vias sem iluminação e sem veículos à frente ou no sentido oposto. Reduza para o baixo ao aproximar de outros veículos a 300 m.
• Fique atento a pedestres e ciclistas, que têm visibilidade reduzida.

### Vento Lateral
Comum em pontes, viadutos e rodovias de planalto. Reduza a velocidade e segure o volante firme com as duas mãos. Atenção especial para veículos altos (caminhões, ônibus) que podem ser deslocados lateralmente.`,
                },
                {
                    titulo: 'Manobras Seguras',
                    descricao: 'Como executar ultrapassagem, conversões e estacionamento com segurança.',
                    ordem: 5, duracao: 9,
                    videoUrl: null,
                    conteudo: `### Ultrapassagem Segura
Antes de ultrapassar, verifique:
1. Se há linha tracejada (ultrapassagem permitida).
2. Se há visibilidade suficiente para completar a manobra.
3. Espelhos retrovisores e ponto cego lateral.
4. Sinalize com a seta, acelere progressivamente, complete a ultrapassagem e retorne à faixa com segurança antes de encontrar veículos.

Nunca ultrapasse próximo a curvas, cruzamentos, viadutos, vias de duplo sentido com linha contínua ou quando o veículo à frente também estiver ultrapassando.

### Conversões e Retornos
• Sinalizar com pelo menos 30 m de antecedência em vias urbanas.
• Verificar espelhos e ponto cego antes de mudar de faixa.
• Reduzir a velocidade antes de iniciar a curva — não durante.
• Em retornos, dar preferência a veículos que trafegam em linha reta.

### Estacionamento em Ladeiras
• Em descida com guia: vire as rodas em direção à guia para que o veículo encoste nela se soltar.
• Em subida com guia: vire as rodas para longe da guia.
• Sempre engatar a marcha (1ª ou ré) e acionar o freio de estacionamento.

### Marcha-Ré e Garagem
Antes de engatar a ré, verifique com os espelhos e se necessário desça para verificar pessoalmente o espaço atrás do veículo — especialmente com crianças e animais por perto.`,
                },
            ],
        },

        {
            titulo: 'Noções de Mecânica',
            cargaHoraria: 6,
            aulas: [
                {
                    titulo: 'Componentes Básicos do Veículo',
                    descricao: 'Conheça o motor, câmbio, suspensão e os sistemas principais.',
                    ordem: 1, duracao: 15,
                    videoUrl: 'https://www.youtube.com/embed/PaGh95EeaZ0',
                    conteudo: null,
                },
                {
                    titulo: 'Sistema de Freios',
                    descricao: 'Como funcionam os freios a disco, a tambor e o ABS.',
                    ordem: 2, duracao: 10,
                    videoUrl: null,
                    conteudo: `### Tipos de Freios
Os veículos modernos utilizam dois tipos principais de freios:

Freio a disco — emprega pastilhas que pressionam um disco metálico. Oferece melhor desempenho em altas velocidades e dissipação de calor mais eficiente. Presente nas rodas dianteiras da maioria dos veículos e nas traseiras de veículos mais modernos.

Freio a tambor — emprega lonas que pressionam a parte interna de um tambor cilíndrico. Mais econômico e ainda comum nas rodas traseiras de veículos populares.

### ABS (Antilock Braking System)
O ABS evita o travamento das rodas durante frenagens bruscas, permitindo que o condutor mantenha o controle direcional do veículo. Durante uma frenagem com ABS ativo, você sentirá pulsações no pedal — é normal, não solte o pedal. O ABS não reduz necessariamente a distância de frenagem, mas preserva a dirigibilidade.

### Sinais de Desgaste
• Rangido ou guincho ao frear: pastilhas desgastadas.
• Vibração no pedal: disco empenado.
• Pedal esponjoso ou que vai ao fundo: ar no circuito hidráulico ou falta de fluido.
• Veículo puxando para um lado ao frear: pistão de pinça travado.

### Fluido de Freio
Deve ser trocado conforme o manual do fabricante (em geral a cada 2 anos ou 40.000 km). O fluido absorve umidade com o tempo, o que reduz seu ponto de ebulição e a eficiência da frenagem — fenômeno chamado de "freio fervendo" (vapor lock).`,
                },
                {
                    titulo: 'Pneus e Amortecedores',
                    descricao: 'Calibragem, desgaste, rodízio e suspensão.',
                    ordem: 3, duracao: 9,
                    videoUrl: null,
                    conteudo: `### Calibragem dos Pneus
A pressão correta está indicada na etiqueta colada na coluna da porta do motorista ou no manual do veículo — nunca na parede lateral do pneu (esse valor é a pressão máxima).

Pneu calibrado corretamente garante:
• Estabilidade e segurança na direção.
• Menor consumo de combustível.
• Desgaste uniforme.
• Melhor aderência em curvas e frenagens.

Pneu murchou 10%: resistência de rolamento aumenta 5% e consumo sobe. Pneu vazio em mais de 30%: risco de desmontagem da borracha do aro (blow-out).

### Desgaste dos Pneus
Indicadores de desgaste (TWI) são protuberâncias no fundo dos sulcos. Quando a superfície do pneu nivelar com o TWI, o pneu deve ser substituído. A espessura mínima legal é 1,6 mm de profundidade de sulco.

Desgaste irregular indica:
• Desgaste central: pneu calibrado a mais.
• Desgaste nas bordas: pneu calibrado a menos.
• Desgaste em um só lado: problemas de alinhamento ou geometria da suspensão.

### Rodízio de Pneus
Recomendado a cada 10.000 km. Permite que todos os pneus desgastem de forma mais uniforme, prolongando a vida útil do conjunto.

### Amortecedores
Os amortecedores controlam o balanço da carroceria e mantêm os pneus em contato com o asfalto. Amortecedor desgastado aumenta a distância de frenagem, piora a dirigibilidade e desgasta pneus irregularmente. Teste: pressione a lataria sobre cada roda — o veículo deve subir e estabilizar em um movimento. Se balançar mais de uma vez, os amortecedores precisam de revisão.`,
                },
                {
                    titulo: 'Manutenção Preventiva',
                    descricao: 'Revisões periódicas, troca de fluidos e itens de segurança obrigatórios.',
                    ordem: 4, duracao: 8,
                    videoUrl: null,
                    conteudo: `### Por que fazer manutenção preventiva?
A manutenção preventiva evita panes inesperadas, prolonga a vida útil do veículo, reduz custos com reparos e garante a segurança do condutor e de outros usuários. Veículos mal conservados são causa frequente de acidentes e infrações (como faróis queimados e freios deficientes).

### Itens de Revisão Periódica
• Óleo do motor — troca conforme o manual (em geral a cada 10.000 km ou 1 ano). Sempre verificar o nível antes de viagens longas.
• Filtro de óleo — trocado junto com o óleo.
• Filtro de ar do motor — em geral a cada 20.000 km ou conforme sujeira.
• Filtro de combustível — a cada 30.000–40.000 km.
• Velas de ignição — de 30.000 a 60.000 km dependendo do tipo.
• Correia dentada — item crítico; ruptura causa dano grave ao motor. Trocar no prazo indicado pelo fabricante.

### Itens de Segurança Obrigatórios
• Extintor de incêndio veicular — verificar validade (indicada no próprio extintor) e recarga anual.
• Triângulo de segurança — obrigatório, deve ser posicionado a 30 m do veículo em vias urbanas e 100 m em rodovias.
• Macaco e chave de rodas — essenciais para troca de pneus.

### Luzes de Alerta no Painel
• Ícone de óleo vermelho piscando: pare imediatamente e verifique o nível de óleo.
• Temperatura do motor no vermelho: pare, desligue e aguarde esfriar antes de abrir o radiador.
• Bateria: problema no alternador ou na bateria; leve ao mecânico em breve.
• ABS: sistema desativado; freios funcionam normalmente, mas sem assistência eletrônica.`,
                },
            ],
        },

        {
            titulo: 'Meio Ambiente e Cidadania',
            cargaHoraria: 5,
            aulas: [
                {
                    titulo: 'Impacto Ambiental dos Veículos',
                    descricao: 'Como o trânsito afeta o meio ambiente e o que o CTB determina.',
                    ordem: 1, duracao: 11,
                    videoUrl: 'https://www.youtube.com/embed/bMmyev52Sl8',
                    conteudo: null,
                },
                {
                    titulo: 'Controle de Emissões',
                    descricao: 'Programa PROCONVE, inspeção veicular e emissão de poluentes.',
                    ordem: 2, duracao: 9,
                    videoUrl: null,
                    conteudo: `### Poluentes Emitidos pelos Veículos
Os principais poluentes produzidos pelos motores a combustão são:

• Monóxido de carbono (CO) — gás inodoro e tóxico, altamente prejudicial à saúde.
• Hidrocarbonetos (HC) — produto da combustão incompleta; causam irritação e são precursores do smog.
• Óxidos de nitrogênio (NOx) — contribuem para a chuva ácida e problemas respiratórios.
• Material particulado — partículas finas que penetram nos pulmões.
• CO₂ — principal gás de efeito estufa, contribui para o aquecimento global.

### PROCONVE
O Programa de Controle da Poluição do Ar por Veículos Automotores (PROCONVE), regulamentado pelo CONAMA, estabelece limites máximos de emissão para veículos novos comercializados no Brasil. O programa foi inspirado na norma americana e já está em sua fase L7, com metas cada vez mais rígidas.

### Inspeção Veicular (Programa I/M)
Municípios como São Paulo e Rio de Janeiro possuem programas de inspeção obrigatória de emissões e segurança. Veículos que emitem fumaça preta excessiva são reprovados e o proprietário deve realizar os reparos necessários.

### Emitir Fumaça Preta
Infração prevista no CTB (art. 230, IX): gravíssima, com multa e retenção do veículo. A causa mais comum é injeção de combustível desregulada, filtro de ar entupido ou desgaste do motor.

### Como Reduzir a Emissão
• Manter o veículo revisado (filtro de ar, velas, injeção).
• Calibrar os pneus — pneu murcho aumenta o consumo em até 10%.
• Evitar aceleração brusca e freadas desnecessárias (direção econômica).
• Desligar o motor em paradas superiores a 1 minuto.`,
                },
                {
                    titulo: 'Cidadania e Respeito no Trânsito',
                    descricao: 'O trânsito como espaço coletivo e o papel de cada condutor.',
                    ordem: 3, duracao: 8,
                    videoUrl: null,
                    conteudo: `### Trânsito é Convivência
O trânsito é um espaço público compartilhado por pedestres, ciclistas, motociclistas e motoristas. Respeitar o espaço do outro e seguir as regras é um exercício de cidadania que salva vidas.

### Pedestres e Ciclistas
O CTB coloca pedestres e ciclistas como os usuários mais vulneráveis do trânsito e determina que o condutor lhes dê preferência em diversas situações:
• Faixa de pedestres sem semáforo: obrigatório parar ou aguardar.
• Acesso a garagem ou driveway: quem sai deve ceder passagem ao pedestre na calçada.
• Ciclovias e ciclofaixas: proibido estacionar, trafegar ou parar sobre elas.

### Buzina
O CTB permite o uso da buzina apenas para alertar outros condutores em situação de risco, em ultrapassagens e em locais perigosos. Uso abusivo da buzina é infração leve.

### Vagas Especiais
Estacionar em vagas de pessoas com deficiência ou idosos sem credencial é infração gravíssima, com multa multiplicada por 3 e remoção do veículo. Essas vagas garantem acessibilidade e são direito legal dessas pessoas.

### Respeito à Faixa Exclusiva
Trafegar em corredor de ônibus, faixa de pedestre ou acostamento sem autorização é infração grave. Essas faixas existem para garantir fluidez e segurança do transporte coletivo e dos pedestres.

### Jogar Lixo pela Janela
Infração média, com multa. Além do aspecto legal, jogar lixo na via prejudica a drenagem, entope bueiros e contribui para enchentes urbanas.`,
                },
                {
                    titulo: 'Destinação de Resíduos Veiculares',
                    descricao: 'Como descartar corretamente óleo, pneus, baterias e outros resíduos.',
                    ordem: 4, duracao: 7,
                    videoUrl: null,
                    conteudo: `### Por que o Descarte Correto Importa?
Resíduos de veículos contêm substâncias altamente tóxicas. Um litro de óleo lubrificante usado pode contaminar até 1 milhão de litros de água, tornando-a imprópria para consumo e prejudicando ecossistemas.

### Óleo Lubrificante Usado
A Resolução CONAMA 362/2005 proíbe o descarte de óleo em vias, terrenos ou na rede de esgoto. O descarte correto é feito em postos coletores credenciados (postos de combustível, revendedoras de óleo, oficinas autorizadas). O óleo coletado é re-refinado e transformado em novo óleo base.

### Pneus Inservíveis
Pela Resolução CONAMA 416/2009, fabricantes e importadores são obrigados a recolher e dar destinação ambientalmente correta aos pneus. Os pontos de coleta incluem borracharias, distribuidoras e revendas de pneus. Pneus descartados incorretamente viram criadouros do mosquito Aedes aegypti.

### Baterias Automotivas
Contêm chumbo e ácido sulfúrico — altamente tóxicos. A Lei 12.305/2010 obriga a devolução ao estabelecimento que vende a nova bateria. O fabricante é responsável pelo processo de reciclagem.

### Fluidos e Filtros
Filtros de óleo usados e fluidos (freio, arrefecimento, transmissão) não devem ser misturados ao lixo comum. Entregue em postos de coleta ou oficinas com sistema de gestão de resíduos.

### Vidros e Catalisadores
Catalisadores contêm metais preciosos (platina, paládio, ródio) e têm cadeia de reciclagem própria. Não os descarte em lixo comum — sucatas e recicladoras especializadas os reaproveitam.`,
                },
            ],
        },

        {
            titulo: 'Primeiros Socorros',
            cargaHoraria: 5,
            aulas: [
                {
                    titulo: 'Primeiros Socorros no Trânsito',
                    descricao: 'Como agir nos primeiros momentos após um acidente de trânsito.',
                    ordem: 1, duracao: 13,
                    videoUrl: 'https://www.youtube.com/embed/LqFi04wW8dU',
                    conteudo: null,
                },
                {
                    titulo: 'RCP: Ressuscitação Cardiopulmonar',
                    descricao: 'Técnica de compressões torácicas e respiração de resgate.',
                    ordem: 2, duracao: 11,
                    videoUrl: null,
                    conteudo: `### Quando Iniciar a RCP
Inicie a RCP quando a vítima estiver inconsciente, não respirar normalmente (ausência de respiração ou respiração agônica — "gasping") e não apresentar sinais de circulação. Chame o SAMU (192) ou Bombeiros (193) imediatamente ou peça para alguém ligar enquanto você inicia a RCP.

### Técnica de Compressões Torácicas (adultos)
1. Posicione a vítima em superfície rígida, deitada de costas.
2. Ajoelhe-se ao lado do tórax da vítima.
3. Coloque a palma de uma mão no centro do peito (metade inferior do esterno).
4. Sobreponha a outra mão, entrelaçando os dedos.
5. Com os braços estendidos, comprima o tórax com força: profundidade de 5 a 6 cm.
6. Ritmo: 100 a 120 compressões por minuto (cadência de "Stayin' Alive" dos Bee Gees).
7. Permita o retorno completo do tórax entre as compressões.

### Ventilação (Respiração de Resgate)
Proporção para leigos: 30 compressões para 2 ventilações. Incline a cabeça da vítima levemente para trás, eleve o queixo, cubra a boca da vítima com a sua e sopre por 1 segundo observando o peito subir. Se não souber fazer ventilação, faça apenas as compressões — é mais eficaz do que não fazer nada.

### DEA (Desfibrilador Externo Automático)
Se houver um DEA disponível (shopping, aeroporto, academia), ligue-o e siga as instruções de voz. O aparelho analisa o ritmo cardíaco e aplica choque se necessário. Não interrompa as compressões até o DEA estar posicionado.

### RCP em Crianças e Bebês
A técnica é adaptada: para crianças, use uma mão; para bebês, use dois dedos. A profundidade é de cerca de 4 cm. A proporção permanece 30:2.`,
                },
                {
                    titulo: 'Hemorragias, Fraturas e Trauma',
                    descricao: 'Como controlar sangramentos e imobilizar fraturas no local do acidente.',
                    ordem: 3, duracao: 10,
                    videoUrl: null,
                    conteudo: `### Controle de Hemorragias
A medida mais eficaz para conter hemorragia externa é a pressão direta:
1. Cubra o ferimento com pano limpo ou curativo.
2. Pressione firmemente com a mão.
3. Não remova o pano se ele encharcar — adicione mais camadas por cima e mantenha a pressão.
4. Se possível, eleve o membro lesionado acima do nível do coração.

Torniquete: use apenas em hemorragias graves em membros que não cessam com pressão direta. Registre o horário da aplicação e informe os socorristas. Nunca retire um torniquete após aplicado.

### Objeto Perfurante Encravado
Não remova o objeto — ele pode estar tampando uma artéria e impedindo sangramento ainda maior. Imobilize o objeto com panos ao redor e aguarde socorro especializado.

### Suspeita de Fratura
Sinais: dor intensa, deformidade, inchaço, impossibilidade de movimentar o membro.
• Não tente recolocar o osso no lugar.
• Imobilize o membro na posição em que se encontra com tala improvisada (tábua, revista, papelão) fixada com ataduras ou panos.
• Cubra com pano limpo em caso de fratura exposta — não toque o osso.

### Suspeita de Lesão na Coluna
Qualquer vítima de acidente de trânsito deve ser tratada como suspeita de lesão na coluna até prova em contrário.
• Não mova a vítima, exceto em risco de incêndio ou afogamento iminente.
• Mantenha a cabeça alinhada com o corpo.
• Se for necessário mover, faça em bloco (rolamento em tronco) com auxílio de pelo menos 3 pessoas.
• Aguarde o SAMU — eles possuem equipamentos de imobilização adequados.`,
                },
                {
                    titulo: 'Queimaduras, Engasgo e Intoxicações',
                    descricao: 'Atendimento às vítimas de queimadura, engasgo e exposição a produtos químicos.',
                    ordem: 4, duracao: 9,
                    videoUrl: null,
                    conteudo: `### Queimaduras
Classificação por grau:
• 1º grau: vermelhidão, sem bolha (ex.: queimadura de sol).
• 2º grau: bolhas, dor intensa.
• 3º grau: pele carbonizada ou esbranquiçada, pode haver ausência de dor (nervo destruído).

Condutas para queimaduras de 1º e 2º grau:
1. Resfrie a área imediatamente com água corrente fria por 10 a 20 minutos.
2. Não estoure as bolhas — elas protegem contra infecção.
3. Não aplique pasta dental, manteiga, óleo ou qualquer substância caseira.
4. Cubra com pano limpo úmido e encaminhe ao serviço de saúde.

Para queimaduras de 3º grau ou extensas (mais de 10% do corpo): acione o SAMU imediatamente e mantenha a vítima aquecida.

### Engasgo (Obstrução de Vias Aéreas)
Adulto consciente com obstrução grave (não consegue falar, tossir ou respirar):
1. Posicione-se atrás da vítima.
2. Envolva a cintura com os braços.
3. Feche uma mão em punho acima do umbigo e abaixo do esterno.
4. Cubra com a outra mão e aplique compressões rápidas para dentro e para cima (manobra de Heimlich) até o objeto ser expelido ou a vítima perder a consciência.

Se a vítima perder a consciência: inicie a RCP e verifique a boca antes de cada ventilação.

### Intoxicações e Acidentes com Produtos Químicos
Em acidentes com veículos que transportam produtos perigosos (identificados com painéis de segurança coloridos no veículo):
• Não se aproxime da área sem equipamento de proteção.
• Afaste a vítima do local se for seguro, sem contato com a substância.
• Ligue para o SAMU (192) informando o número de identificação do produto (painel).
• Em caso de contato cutâneo: lave abundantemente com água.
• Nunca induza vômito em caso de ingestão de substância corrosiva.`,
                },
            ],
        },
    ];

    for (const cursoData of CURSOS) {
        let curso = await prisma.curso.findFirst({ where: { curso_titulo: cursoData.titulo } });
        if (!curso) {
            curso = await prisma.curso.create({
                data: { curso_titulo: cursoData.titulo, curso_carga_horaria: cursoData.cargaHoraria },
            });
        }

        const aulasAntigas = await prisma.aula.findMany({ where: { curso_id: curso.curso_id }, select: { aula_id: true } });
        if (aulasAntigas.length > 0) {
            const ids = aulasAntigas.map(a => a.aula_id);
            await prisma.alunoAula.deleteMany({ where: { aula_id: { in: ids } } });
            await prisma.aula.deleteMany({ where: { curso_id: curso.curso_id } });
        }

        await prisma.aula.createMany({
            data: cursoData.aulas.map(a => ({
                curso_id:             curso.curso_id,
                aula_titulo:          a.titulo,
                aula_descricao:       a.descricao,
                aula_ordem:           a.ordem,
                aula_duracao_minutos: a.duracao,
                aula_url_video:       a.videoUrl,
                aula_conteudo_texto:  a.conteudo,
                aula_status_aula:     'publicada',
            })),
        });

        console.log(`✓ Curso "${cursoData.titulo}" seedado com ${cursoData.aulas.length} aulas`);
    }

    console.log('\n✅ Seed concluído — 5 cursos e todas as aulas no banco.');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
