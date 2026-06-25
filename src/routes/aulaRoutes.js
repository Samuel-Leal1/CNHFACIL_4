import express from 'express';
import { listarAulas, listarCursos, listarAulasCurso, concluirAula } from '../controllers/aulaController.js';
import { verificarToken } from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/aulas:
 *   get:
 *     summary: Lista aulas públicas
 *     tags: [Aulas]
 *     responses:
 *       200:
 *         description: Lista de aulas obtida com sucesso
 */
router.get('/', listarAulas);

/**
 * @swagger
 * /api/aulas/cursos:
 *   get:
 *     summary: Lista cursos disponíveis (requer autenticação)
 *     tags: [Aulas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos obtida com sucesso
 */
router.get('/cursos', verificarToken, listarCursos);

/**
 * @swagger
 * /api/aulas/curso/{cursoId}:
 *   get:
 *     summary: Lista aulas de um curso (requer autenticação)
 *     tags: [Aulas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de aulas do curso
 */
router.get('/curso/:cursoId', verificarToken, listarAulasCurso);

/**
 * @swagger
 * /api/aulas/{aulaId}/concluir:
 *   post:
 *     summary: Marca uma aula como concluída (requer autenticação)
 *     tags: [Aulas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aulaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aula marcada como concluída
 */
router.post('/:aulaId/concluir', verificarToken, concluirAula);

export default router;
