import express from 'express';
import { listarAulas } from '../controllers/aulaController.js';

const router = express.Router();

/**
 * @swagger
 * /api/aulas:
 *   get:
 *     summary: Lista todas as aulas e progresso por matéria do aluno
 *     tags: [Aulas]
 *     responses:
 *       200:
 *         description: Lista de matérias e aulas assistidas obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', listarAulas);

export default router;