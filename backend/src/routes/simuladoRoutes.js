import express from 'express';
import { gerarSimulado, enviarSimulado } from '../controllers/simuladoController.js';

const router = express.Router();

/**
 * @swagger
 * /api/simulados/gerar:
 *   post:
 *     summary: Gera um novo simulado personalizado (Geral ou por Matéria)
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
 *                 description: Se tipo for 'materia', indicar o tema desejado
 *                 example: Legislação de Trânsito
 *               quantidade:
 *                 type: integer
 *                 description: Número de questões no simulado (ex. 10, 30 ou 40)
 *                 example: 10
 *     responses:
 *       200:
 *         description: Simulado gerado com sucesso (as questões retornadas não possuem a resposta correta exposta)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/gerar', gerarSimulado);

/**
 * @swagger
 * /api/simulados/enviar:
 *   post:
 *     summary: Envia as respostas de um simulado para correção e computação no histórico
 *     tags: [Simulados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - respostas
 *             properties:
 *               materia:
 *                 type: string
 *                 example: Geral
 *               respostas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                     - selectedOption
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                       example: 1
 *                     selectedOption:
 *                       type: integer
 *                       description: Índice selecionado (0 a 3). Usar null se não respondido.
 *                       example: 0
 *     responses:
 *       200:
 *         description: Correção realizada com sucesso, retorna a nota e o gabarito comentado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/enviar', enviarSimulado);

export default router;