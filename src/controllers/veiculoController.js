import { veiculos } from '../dadosMockados.js';

export const listarVeiculos = (req, res) => {
    try {
        return res.json(veiculos);
    } catch (erro) {
        console.error('Erro ao listar veículos:', erro);
        return res.status(500).json({ erro: 'Erro ao obter veículos da frota.' });
    }
};