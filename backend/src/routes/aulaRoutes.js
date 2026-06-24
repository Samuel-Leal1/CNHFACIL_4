import express from 'express';
import { listarAulas, listarCursos, listarAulasCurso, concluirAula } from '../controllers/aulaController.js';
import { verificarToken } from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

router.get('/', listarAulas);
router.get('/cursos', verificarToken, listarCursos);
router.get('/curso/:cursoId', verificarToken, listarAulasCurso);
router.post('/:aulaId/concluir', verificarToken, concluirAula);

export default router;
