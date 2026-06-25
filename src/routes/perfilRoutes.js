import express from 'express';
import {
    obterPerfil,
    obterDesempenho,
    obterDashboard,
    atualizarPerfil,
    listarAlunos,
    listarInstrutores,
} from '../controllers/perfilController.js';
import { verificarToken } from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/perfil/dashboard:
 *   get:
 *     summary: Obtém métricas de dashboard para o perfil autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard obtido com sucesso
 */
router.get('/perfil/dashboard', verificarToken, obterDashboard);

/**
 * @swagger
 * /api/perfil:
 *   get:
 *     summary: Obtém os dados do perfil autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 */
router.get('/perfil', verificarToken, obterPerfil);

/**
 * @swagger
 * /api/perfil:
 *   put:
 *     summary: Atualiza os dados do perfil autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               novaSenha:
 *                 type: string
 *               confirmarSenha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 */
router.put('/perfil', verificarToken, atualizarPerfil);

/**
 * @swagger
 * /api/desempenho:
 *   get:
 *     summary: Obtém métricas de desempenho do usuário autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Desempenho obtido com sucesso
 */
router.get('/desempenho', verificarToken, obterDesempenho);

/**
 * @swagger
 * /api/admin/alunos:
 *   get:
 *     summary: Lista alunos (requer permissão de admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de alunos obtida com sucesso
 */
router.get('/admin/alunos', verificarToken, listarAlunos);

/**
 * @swagger
 * /api/instrutores:
 *   get:
 *     summary: Lista instrutores cadastrados
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de instrutores obtida com sucesso
 */
router.get('/instrutores', verificarToken, listarInstrutores);

export default router;
