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

router.get('/perfil/dashboard', verificarToken, obterDashboard);
router.get('/perfil', verificarToken, obterPerfil);
router.put('/perfil', verificarToken, atualizarPerfil);
router.get('/desempenho', verificarToken, obterDesempenho);
router.get('/admin/alunos', verificarToken, listarAlunos);
router.get('/instrutores', verificarToken, listarInstrutores);

export default router;
