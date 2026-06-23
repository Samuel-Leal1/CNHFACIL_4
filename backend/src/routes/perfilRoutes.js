import express from 'express';
import { obterPerfil, obterDesempenho, obterDashboard, atualizarPerfil } from '../controllers/perfilController.js';
import { verificarToken } from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/perfil/dashboard:
 *   get:
 *     summary: Retorna os dados resumidos do dashboard do aluno autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do dashboard (resumo, histórico de simulados, cursos)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/perfil/dashboard', verificarToken, obterDashboard);

/**
 * @swagger
 * /api/perfil:
 *   get:
 *     summary: Obtém os dados cadastrais e jornada do usuário autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados detalhados do perfil do usuário
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/perfil', verificarToken, obterPerfil);

// Atualiza dados do perfil do usuário autenticado
router.put('/perfil', verificarToken, atualizarPerfil);

/**
 * @swagger
 * /api/desempenho:
 *   get:
 *     summary: Obtém as métricas de desempenho e histórico de simulados
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório analítico de desempenho do aluno
 *       401:
 *         description: Não autorizado
 */
router.get('/desempenho', verificarToken, obterDesempenho);

export default router;