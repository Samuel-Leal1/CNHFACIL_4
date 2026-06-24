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
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
