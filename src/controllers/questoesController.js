import { questoes } from '../dadosMockados.js';

export const listarQuestoes = (req, res) => {
    try {
        const filtro = req.query.tema || req.query.materia || '';
        let resultado = questoes;

        if (filtro) {
            resultado = resultado.filter(q => q.theme.toLowerCase() === filtro.toLowerCase());
        }

        return res.json(resultado);
    } catch (erro) {
        console.error('Erro ao listar questões:', erro);
        return res.status(500).json({ erro: 'Erro ao listar questões.' });
    }
};

export const obterQuestaoPorId = (req, res) => {
    const { id } = req.params;
    try {
        const questao = questoes.find(q => q.id === Number(id));

        if (!questao) {
            return res.status(404).json({ erro: 'Questão não encontrada.' });
        }

        return res.json(questao);
    } catch (erro) {
        console.error('Erro ao obter questão:', erro);
        return res.status(500).json({ erro: 'Erro ao buscar questão.' });
    }
};

export const criarQuestao = (req, res) => {
    const { theme, text, options, correctAnswer } = req.body;

    // Validação básica
    if (!theme || !text || !options || correctAnswer === undefined) {
        return res.status(400).json({ erro: 'Todos os campos (theme, text, options, correctAnswer) são obrigatórios.' });
    }

    if (!Array.isArray(options) || options.length !== 4) {
        return res.status(400).json({ erro: 'O campo options deve ser uma lista com exatamente 4 opções de resposta.' });
    }

    if (typeof correctAnswer !== 'number' || correctAnswer < 0 || correctAnswer > 3) {
        return res.status(400).json({ erro: 'O campo correctAnswer deve ser um número correspondente ao índice da opção correta (0 a 3).' });
    }

    try {
        const nextId = questoes.length > 0 ? Math.max(...questoes.map(q => q.id)) + 1 : 1;
        const novaQuestao = {
            id: nextId,
            theme,
            text,
            options,
            correctAnswer
        };

        questoes.push(novaQuestao);
        return res.status(201).json(novaQuestao);
    } catch (erro) {
        console.error('Erro ao criar questão:', erro);
        return res.status(500).json({ erro: 'Erro ao criar questão.' });
    }
};

export const atualizarQuestao = (req, res) => {
    const { id } = req.params;
    const { theme, text, options, correctAnswer } = req.body;

    try {
        const index = questoes.findIndex(q => q.id === Number(id));
        if (index === -1) {
            return res.status(404).json({ erro: 'Questão não encontrada.' });
        }

        // Validações das opções e resposta se enviadas
        if (options !== undefined) {
            if (!Array.isArray(options) || options.length !== 4) {
                return res.status(400).json({ erro: 'O campo options deve conter exatamente 4 itens.' });
            }
        }

        if (correctAnswer !== undefined) {
            if (typeof correctAnswer !== 'number' || correctAnswer < 0 || correctAnswer > 3) {
                return res.status(400).json({ erro: 'O campo correctAnswer deve ser um número entre 0 e 3.' });
            }
        }

        if (theme !== undefined) questoes[index].theme = theme;
        if (text !== undefined) questoes[index].text = text;
        if (options !== undefined) questoes[index].options = options;
        if (correctAnswer !== undefined) questoes[index].correctAnswer = correctAnswer;

        return res.json(questoes[index]);
    } catch (erro) {
        console.error('Erro ao atualizar questão:', erro);
        return res.status(500).json({ erro: 'Erro ao atualizar questão.' });
    }
};

export const deletarQuestao = (req, res) => {
    const { id } = req.params;
    try {
        const index = questoes.findIndex(q => q.id === Number(id));

        if (index === -1) {
            return res.status(404).json({ erro: 'Questão não encontrada.' });
        }

        questoes.splice(index, 1);
        return res.json({ mensagem: 'Questão excluída com sucesso.' });
    } catch (erro) {
        console.error('Erro ao deletar questão:', erro);
        return res.status(500).json({ erro: 'Erro ao deletar questão.' });
    }
};