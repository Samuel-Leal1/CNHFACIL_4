import { usuarios, historicoSimulados } from '../dadosMockados.js';

export const obterPerfil = (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const usuario = usuarios.find(u => u.id === Number(usuarioId));

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        const { senhaHash, ...perfilPublico } = usuario;
        return res.json(perfilPublico);
    } catch (erro) {
        console.error('Erro ao obter perfil:', erro);
        return res.status(500).json({ erro: 'Erro ao buscar perfil.' });
    }
};

export const obterDesempenho = (req, res) => {
    try {
        const historico = historicoSimulados;

        if (historico.length === 0) {
            return res.json({
                simuladosRealizados: 0,
                mediaAcertos: 0,
                questoesRespondidas: 0,
                melhorDesempenho: 0,
                historico: [],
                desempenhoPorMateria: {
                    "Legislação de Trânsito": 0,
                    "Direção Defensiva": 0,
                    "Primeiros Socorros": 0
                }
            });
        }

        // Cálculos dinâmicos com base no histórico de simulados
        const simuladosRealizados = historico.length;
        const totalNotas = historico.reduce((acc, curr) => acc + curr.notaPercent, 0);
        const mediaAcertos = Math.round(totalNotas / simuladosRealizados);
        const questoesRespondidas = historico.reduce((acc, curr) => acc + curr.total, 0);
        const melhorDesempenho = Math.max(...historico.map(h => h.notaPercent));

        // Desempenho por categoria/matéria
        const categorias = ["Legislação de Trânsito", "Direção Defensiva", "Primeiros Socorros"];
        const desempenhoPorMateria = {};

        categorias.forEach(cat => {
            const simuladosMateria = historico.filter(h => h.categoria.toLowerCase() === cat.toLowerCase() || (cat === "Legislação de Trânsito" && h.categoria === "Geral"));
            if (simuladosMateria.length > 0) {
                const somaMateria = simuladosMateria.reduce((acc, curr) => acc + curr.notaPercent, 0);
                desempenhoPorMateria[cat] = Math.round(somaMateria / simuladosMateria.length);
            } else {
                // Valores mockados iniciais se não houver dados reais suficientes
                if (cat === "Legislação de Trânsito") desempenhoPorMateria[cat] = 78;
                if (cat === "Direção Defensiva") desempenhoPorMateria[cat] = 72;
                if (cat === "Primeiros Socorros") desempenhoPorMateria[cat] = 68;
            }
        });

        return res.json({
            simuladosRealizados,
            mediaAcertos,
            questoesRespondidas,
            melhorDesempenho,
            historico,
            desempenhoPorMateria
        });
    } catch (erro) {
        console.error('Erro ao obter desempenho:', erro);
        return res.status(500).json({ erro: 'Erro ao buscar métricas de desempenho.' });
    }
};