import { PrismaClient } from '@prisma/client';
import { aulas as aulasMock } from '../dadosMockados.js';

const prisma = new PrismaClient();

// GET /api/aulas
export const listarAulas = (req, res) => res.json(aulasMock);

// GET /api/aulas/cursos
export const listarCursos = async (req, res) => {
    try {
        const usuarioId = req.usuarioId ? Number(req.usuarioId) : null;

        const cursos = await prisma.curso.findMany({
            include: { aulas: { select: { aula_id: true } } }
        });

        if (cursos.length === 0) {
            return res.json(aulasMock.map(a => ({
                id: a.id, nome: a.titulo, icon: '📚',
                aulas: a.aulasConcluidas, totalAulas: a.aulasTotais, progresso: a.progresso,
            })));
        }

        const resultado = await Promise.all(cursos.map(async c => {
            const total = c.aulas.length;
            let concluidas = 0;
            if (usuarioId) {
                concluidas = await prisma.alunoAula.count({ where: { aluno_id: usuarioId, aula: { curso_id: c.curso_id } } });
            }
            const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;
            return {
                id: c.curso_id,
                nome: c.curso_titulo,
                icon: '📚',
                aulas: concluidas,
                totalAulas: total,
                progresso,
            };
        }));

        return res.json(resultado);
    } catch (erro) {
        console.error('Erro ao listar cursos:', erro);
        return res.status(500).json({ erro: 'Erro ao obter cursos.' });
    }
};

// GET /api/aulas/curso/:cursoId
export const listarAulasCurso = async (req, res) => {
    try {
        const cursoId   = Number(req.params.cursoId);
        const usuarioId = req.usuarioId ? Number(req.usuarioId) : null;

        const aulasBanco = await prisma.aula.findMany({
            where: { curso_id: cursoId },
            orderBy: { aula_ordem: 'asc' },
        });

        if (aulasBanco.length === 0) {
            return res.status(404).json({ erro: 'Curso não encontrado ou sem aulas.' });
        }

        // Busca registros de aulas concluídas do aluno no banco
        let concluidasRows = [];
        if (usuarioId) {
            concluidasRows = await prisma.alunoAula.findMany({
                where: { aluno_id: usuarioId, aula: { curso_id: cursoId } },
                select: { aula_id: true, duracao_assistida: true, concluida_em: true }
            });
        }
        const concluidasSet = new Set(concluidasRows.map(r => r.aula_id));

        const lista = aulasBanco.map((a, i) => {
            const concluida = concluidasSet.has(a.aula_id);
            const anteriorConcluida = i === 0 || concluidasSet.has(aulasBanco[i - 1].aula_id);
            let status = 'locked';
            if (concluida) status = 'done';
            else if (anteriorConcluida) status = i === 0 ? 'current' : 'available';
            return {
                id: a.aula_id,
                titulo: a.aula_titulo,
                descricao: a.aula_descricao || '',
                ordem: a.aula_ordem,
                duracao: a.aula_duracao_minutos,
                videoUrl: a.aula_url_video || null,
                conteudo: a.aula_conteudo_texto || null,
                status,
                concluida,
            };
        });

        if (!lista.some(a => ['current', 'done', 'available'].includes(a.status))) {
            lista[0].status = 'current';
        }

        return res.json(lista);
    } catch (erro) {
        console.error('Erro ao listar aulas do curso:', erro);
        return res.status(500).json({ erro: 'Erro ao obter aulas.' });
    }
};


// POST /api/aulas/:aulaId/concluir
export const concluirAula = async (req, res) => {
    try {
        const aulaId    = Number(req.params.aulaId);
        const usuarioId = req.usuarioId ? Number(req.usuarioId) : null;

        if (!usuarioId) return res.status(401).json({ erro: 'Não autorizado.' });

        // Busca o curso da aula
        const aula = await prisma.aula.findUnique({
            where: { aula_id: aulaId },
            select: { curso_id: true, aula_duracao_minutos: true }
        });
        if (!aula) return res.status(404).json({ erro: 'Aula não encontrada.' });

        const cursoId = aula.curso_id;
        const duracao = aula.aula_duracao_minutos ?? null;

        // Garantir que exista registro em Aluno para este usuario (prisma exige FK)
        const alunoExistente = await prisma.aluno.findUnique({ where: { aluno_id: usuarioId } });
        if (!alunoExistente) {
            await prisma.aluno.create({ data: { aluno_id: usuarioId, aluno_data_nascimento: new Date('2000-01-01'), aluno_categoria_pretendida: 'B' } });
        }

        // Persiste conclusão de aula no banco
        await prisma.alunoAula.upsert({
            where: { aluno_id_aula_id: { aluno_id: usuarioId, aula_id: aulaId } },
            update: { concluida_em: new Date(), duracao_assistida: duracao },
            create: { aluno_id: usuarioId, aula_id: aulaId, concluida_em: new Date(), duracao_assistida: duracao }
        });

        // Persiste matrícula no curso no banco (marca que aluno está no curso)
        await prisma.alunoCurso.upsert({
            where: { aluno_id_curso_id: { aluno_id: usuarioId, curso_id: cursoId } },
            update: { aluno_curso_data_matricula: new Date() },
            create: { aluno_id: usuarioId, curso_id: cursoId },
        });

        // Retorna contagem atualizada de aulas concluídas no curso para atualizar UI imediatamente
        const concluidasCount = await prisma.alunoAula.count({ where: { aluno_id: usuarioId, aula: { curso_id: cursoId } } });

        return res.json({ ok: true, aulaId, concluida: true, concluidasCount });
    } catch (erro) {
        console.error('Erro ao concluir aula:', erro);
        return res.status(500).json({ erro: 'Erro ao concluir aula.' });
    }
};
