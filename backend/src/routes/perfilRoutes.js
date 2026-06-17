import express from 'express';
import { obterPerfil, obterDesempenho } from '../controllers/perfilController.js';
import { verificarToken } from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/perfil:
 *   get:
 *     summary: Obtém os dados cadastrais, financeiros e jornada do usuário autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados detalhados do perfil do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Não autorizado (token inválido ou expirado)
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/perfil', verificarToken, obterPerfil);

/**
 * @swagger
 * /api/desempenho:
 *   get:
 *     summary: Obtém as métricas de desempenho e estatísticas dos simulados realizados
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório analítico de desempenho do aluno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Não autorizado
 */
router.get('/desempenho', verificarToken, obterDesempenho);

export default router;