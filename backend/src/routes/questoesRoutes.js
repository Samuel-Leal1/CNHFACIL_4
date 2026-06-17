import express from 'express';
import {
    listarQuestoes,
    obterQuestaoPorId,
    criarQuestao,
    atualizarQuestao,
    deletarQuestao
} from '../controllers/questoesController.js';
import { verificarToken } from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/questoes:
 *   get:
 *     summary: Lista todas as questões com filtro opcional por tema/matéria
 *     tags: [Questões]
 *     parameters:
 *       - in: query
 *         name: tema
 *         schema:
 *           type: string
 *         description: Filtrar por matéria (ex. Legislação de Trânsito, Sinalização, Direção Defensiva, Primeiros Socorros)
 *     responses:
 *       200:
 *         description: Lista de questões obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', listarQuestoes);

/**
 * @swagger
 * /api/questoes/{id}:
 *   get:
 *     summary: Obtém os detalhes de uma questão específica pelo ID
 *     tags: [Questões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados da questão
 *       404:
 *         description: Questão não encontrada
 */
router.get('/:id', obterQuestaoPorId);

/**
 * @swagger
 * /api/questoes:
 *   post:
 *     summary: Cadastra uma nova questão no banco de dados (Requer Autenticação)
 *     tags: [Questões]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theme
 *               - text
 *               - options
 *               - correctAnswer
 *             properties:
 *               theme:
 *                 type: string
 *                 example: Legislação de Trânsito
 *               text:
 *                 type: string
 *                 example: Qual a velocidade máxima permitida em vias locais se não houver sinalização?
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["30 km/h", "40 km/h", "60 km/h", "80 km/h"]
 *               correctAnswer:
 *                 type: integer
 *                 description: Índice da opção correta (0 a 3)
 *                 example: 0
 *     responses:
 *       201:
 *         description: Questão cadastrada com sucesso
 *       400:
 *         description: Dados inválidos ou ausentes
 *       401:
 *         description: Não autorizado (token ausente ou expirado)
 */
router.post('/', verificarToken, criarQuestao);

/**
 * @swagger
 * /api/questoes/{id}:
 *   put:
 *     summary: Atualiza uma questão existente pelo ID (Requer Autenticação)
 *     tags: [Questões]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *               text:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctAnswer:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Questão atualizada com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Questão não encontrada
 */
router.put('/:id', verificarToken, atualizarQuestao);

/**
 * @swagger
 * /api/questoes/{id}:
 *   delete:
 *     summary: Exclui uma questão pelo ID (Requer Autenticação)
 *     tags: [Questões]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Questão excluída com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Questão não encontrada
 */
router.delete('/:id', verificarToken, deletarQuestao);

export default router;