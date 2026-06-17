import { aulas } from '../dadosMockados.js';

export const listarAulas = (req, res) => {
    try {
        return res.json(aulas);
    } catch (erro) {
        console.error('Erro ao listar aulas:', erro);
        return res.status(500).json({ erro: 'Erro ao obter informações das aulas.' });
    }
};