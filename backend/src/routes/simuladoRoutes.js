import express from 'express';
import { gerarSimulado, enviarSimulado } from '../controllers/simuladoController.js';

const router = express.Router();

// -------------------------------------------------------
// Rotas originais (mantidas para o Swagger)
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
router.post('/gerar', gerarSimulado);

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
router.post('/enviar', enviarSimulado);

// -------------------------------------------------------
// Aliases que o frontend utiliza
// /api/simulados/iniciar   → mesmo que /gerar
// /api/simulados/finalizar → mesmo que /enviar
// -------------------------------------------------------
router.post('/iniciar', gerarSimulado);
router.post('/finalizar', enviarSimulado);

export default router;
