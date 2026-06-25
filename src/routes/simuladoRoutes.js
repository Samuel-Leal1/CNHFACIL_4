import express from 'express';
import { gerarSimulado, enviarSimulado } from '../controllers/simuladoController.js';
import { listarSimulados } from '../controllers/listarSimuladosController.js';
import { tokenOpcional } from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/simulados:
 *   get:
 *     summary: Lista simulados disponíveis (público)
 *     tags: [Simulados]
 *     responses:
 *       200:
 *         description: Lista de simulados obtida com sucesso
 */
router.get('/', listarSimulados);

// -------------------------------------------------------
// Rotas de simulados documentadas pelo Swagger
// -------------------------------------------------------

/**
 * @swagger
 * /api/simulados/gerar:
 *   post:
 *     summary: Gera um novo simulado personalizado
 *     tags: [Simulados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [geral, desafio, materia]
 *                 example: geral
 *               materia:
 *                 type: string
 *                 example: Legislação de Trânsito
 *               quantidade:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Simulado gerado com sucesso
 */
router.post('/gerar', tokenOpcional, gerarSimulado);

/**
 * @swagger
 * /api/simulados/iniciar:
 *   post:
 *     summary: Inicia um simulado, mesmo comportamento de /api/simulados/gerar
 *     tags: [Simulados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [geral, desafio, materia]
 *                 example: geral
 *               materia:
 *                 type: string
 *                 example: Legislação de Trânsito
 *               quantidade:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Simulado gerado com sucesso
 */
router.post('/iniciar', tokenOpcional, gerarSimulado);

/**
 * @swagger
 * /api/simulados/enviar:
 *   post:
 *     summary: Envia respostas para correção
 *     tags: [Simulados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               materia:
 *                 type: string
 *                 example: Geral
 *               respostas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                     selectedOption:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Correção realizada com sucesso
 */
router.post('/enviar', tokenOpcional, enviarSimulado);

/**
 * @swagger
 * /api/simulados/finalizar:
 *   post:
 *     summary: Finaliza um simulado, mesmo comportamento de /api/simulados/enviar
 *     tags: [Simulados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               materia:
 *                 type: string
 *                 example: Geral
 *               respostas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                     selectedOption:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Correção realizada com sucesso
 */
router.post('/finalizar', tokenOpcional, enviarSimulado);

export default router;
