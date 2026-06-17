import express from 'express';
import { listarVeiculos } from '../controllers/veiculoController.js';

const router = express.Router();

/**
 * @swagger
 * /api/veiculos:
 *   get:
 *     summary: Lista todos os veículos da frota cadastrados (Categoria A, B, etc.)
 *     tags: [Veículos]
 *     responses:
 *       200:
 *         description: Lista de veículos obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', listarVeiculos);

export default router;