import express from 'express';
import { login, registro } from '../controllers/autenticacaoController.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuário e gera um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: duda.aluno@email.com
 *               senha:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 token:
 *                   type: string
 *                 usuario:
 *                   type: object
 *       400:
 *         description: Parâmetros obrigatórios ausentes
 *       401:
 *         description: E-mail ou senha incorretos
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria Silva
 *               email:
 *                 type: string
 *                 example: maria.silva@email.com
 *               senha:
 *                 type: string
 *                 example: "12345678"
 *               cargo:
 *                 type: string
 *                 enum: [ALUNO, INSTRUTOR, ADMIN]
 *                 example: ALUNO
 *               categoria:
 *                 type: string
 *                 example: B
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: E-mail já cadastrado ou dados inválidos
 */
router.post('/registro', registro);

export default router;