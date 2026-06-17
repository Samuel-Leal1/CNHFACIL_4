import { questoes, historicoSimulados } from '../dadosMockados.js';

// Função para embaralhar um array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export const gerarSimulado = (req, res) => {
    const { tipo, materia, quantidade } = req.body;

    try {
        let listQuestoes = questoes;
        const qtd = Number(quantidade) || 10; // Padrão: 10 questões

        // Filtra por matéria, caso seja um simulado específico
        if (tipo === 'materia' && materia) {
            listQuestoes = listQuestoes.filter(q => q.theme.toLowerCase() === materia.toLowerCase());
        }

        if (listQuestoes.length === 0) {
            return res.status(400).json({ erro: 'Não foram encontradas questões para os critérios informados.' });
        }

        // Embaralha as questões
        let questoesEmbaralhadas = shuffleArray(listQuestoes);

        // Seleciona a quantidade desejada
        const selecao = questoesEmbaralhadas.slice(0, Math.min(qtd, questoesEmbaralhadas.length));

        // Remove a propriedade correctAnswer para evitar fraude no frontend
        const questoesSeguras = selecao.map(q => {
            const { correctAnswer, ...safeQuestion } = q;
            return safeQuestion;
        });

        // Cria um ID temporário único para o simulado
        const simuladoId = Math.floor(Math.random() * 1000000);

        return res.json({
            simuladoId,
            tipo: tipo || 'geral',
            materia: tipo === 'materia' ? materia : 'Geral',
            quantidadeQuestoes: questoesSeguras.length,
            questoes: questoesSeguras
        });
    } catch (erro) {
        console.error('Erro ao gerar simulado:', erro);
        return res.status(500).json({ erro: 'Erro ao gerar o simulado.' });
    }
};

export const enviarSimulado = (req, res) => {
    const { respostas, materia } = req.body;

    if (!respostas || !Array.isArray(respostas)) {
        return res.status(400).json({ erro: 'O corpo da requisição deve conter a lista de respostas em formato array.' });
    }

    try {
        let acertos = 0;
        const total = respostas.length;
        const questoesDb = questoes;

        const feedback = respostas.map(resp => {
            const questao = questoesDb.find(q => q.id === Number(resp.questionId));
            if (!questao) {
                return {
                    questionId: resp.questionId,
                    erro: 'Questão não encontrada no banco de dados'
                };
            }

            const correto = questao.correctAnswer === resp.selectedOption;
            if (correto) {
                acertos++;
            }

            return {
                questionId: questao.id,
                theme: questao.theme,
                text: questao.text,
                options: questao.options,
                userOption: resp.selectedOption,
                correctOption: questao.correctAnswer,
                wasCorrect: correto
            };
        });

        const notaPercent = total > 0 ? Math.round((acertos / total) * 100) : 0;
        const aprovado = notaPercent >= 70; // Critério do DETRAN: 70% de acertos

        // Registrar o simulado realizado no histórico
        const nextId = historicoSimulados.length > 0 ? Math.max(...historicoSimulados.map(h => h.id)) + 1 : 1;
        const novoResultado = {
            id: nextId,
            data: new Date().toLocaleDateString('pt-BR'),
            acertos,
            total,
            notaPercent,
            categoria: materia || 'Geral'
        };

        // Insere no histórico de simulados do banco em memória
        historicoSimulados.push(novoResultado);

        // Se o usuário estiver logado, podemos também associar (para o usuário padrão Duda)
        // Para simplificar e manter a persistência geral, a lista global atualiza
        // e o endpoint de desempenho recupera esses simulados.

        return res.json({
            mensagem: aprovado ? 'Parabéns, você foi aprovado no simulado!' : 'Infelizmente você não atingiu a nota mínima para aprovação.',
            acertos,
            total,
            notaPercent,
            aprovado,
            feedback
        });
    } catch (erro) {
        console.error('Erro ao enviar simulado:', erro);
        return res.status(500).json({ erro: 'Erro ao corrigir o simulado.' });
    }
};