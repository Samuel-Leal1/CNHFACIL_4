import { historicoSimulados } from '../dadosMockados.js';
import { PrismaClient } from '@prisma/client';

const buildFallback = () => {
  if (historicoSimulados && historicoSimulados.length > 0) {
    return historicoSimulados.map(h => ({ id: h.id, titulo: h.titulo || `Simulado #${h.id}`, notaMinima: h.notaMinima ?? 70 }));
  }
  return [{ id: 1, titulo: 'Geral', notaMinima: 70 }];
};

export const listarSimulados = async (req, res) => {
  // If no DATABASE_URL, avoid calling Prisma and return mock data
  if (!process.env.DATABASE_URL) {
    return res.json(buildFallback());
  }

  const prisma = new PrismaClient();
  try {
    const sims = await prisma.simulado.findMany();
    if (!sims || sims.length === 0) {
      return res.json(buildFallback());
    }
    const result = sims.map(s => ({ id: s.simulado_id, titulo: s.simulado_titulo, notaMinima: Number(s.simulado_nota_minima) }));
    return res.json(result);
  } catch (erro) {
    console.error('Erro ao listar simulados:', erro);
    return res.status(500).json({ erro: 'Erro ao listar simulados.' });
  } finally {
    try { await prisma.$disconnect(); } catch (e) { /* ignore */ }
  }
};
