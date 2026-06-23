import { PrismaClient } from '@prisma/client';
import { historicoSimulados, aulas as aulasMock } from '../dadosMockados.js';

const prisma = new PrismaClient();

// GET /api/perfil
export const obterPerfil = async (req, res) => {
    try {
        const usuarioId = Number(req.usuarioId);

        const usuario = await prisma.usuario.findUnique({
            where: { usuario_id: usuarioId },
            select: {
                usuario_id: true,
                usuario_nome: true,
                usuario_email: true,
                usuario_cpf: true,
                usuario_nivel_acesso: true,
                usuario_telefone: true,
                usuario_foto_perfil: true,
                usuario_criado_em: true,
                aluno: {
                    select: {
                        aluno_data_nascimento: true,
                        aluno_categoria_pretendida: true,
                        aluno_status_aluno: true,
                    }
                }
            }
        });

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        return res.json(usuario);
    } catch (erro) {
        console.error('Erro ao obter perfil:', erro);
        return res.status(500).json({ erro: 'Erro ao buscar perfil.' });
    }
};

// GET /api/desempenho
export const obterDesempenho = async (req, res) => {
    try {
        const usuarioId = Number(req.usuarioId);

        // Busca simulados realizados pelo aluno no banco
        const simuladosAluno = await prisma.alunoSimulado.findMany({
            where: { aluno_id: usuarioId },
            include: {
                simulado: {
                    select: {
                        simulado_titulo: true,
                        simulado_nota_minima: true,
                    }
                }
            }
        });

        // Se não houver dados no banco, usa os mockados como fallback
        const historico = simuladosAluno.length > 0
            ? simuladosAluno.map((s, i) => ({
                id: i + 1,
                data: s.aluno_simulado_data_realizacao,
                notaObtida: Number(s.aluno_simulado_nota_obtida),
                simuladoTitulo: s.simulado.simulado_titulo,
                notaMinima: Number(s.simulado.simulado_nota_minima),
            }))
            : historicoSimulados;

        if (historico.length === 0) {
            return res.json({
                simuladosRealizados: 0,
                mediaAcertos: 0,
                questoesRespondidas: 0,
                melhorDesempenho: 0,
                historico: [],
                desempenhoPorMateria: {
                    "Legislação de Trânsito": 0,
                    "Direção Defensiva": 0,
                    "Primeiros Socorros": 0
                }
            });
        }

        // Cálculos usando dados mockados enquanto não há dados reais suficientes
        const simuladosRealizados = historicoSimulados.length;
        const totalNotas = historicoSimulados.reduce((acc, curr) => acc + curr.notaPercent, 0);
        const mediaAcertos = Math.round(totalNotas / simuladosRealizados);
        const questoesRespondidas = historicoSimulados.reduce((acc, curr) => acc + curr.total, 0);
        const melhorDesempenho = Math.max(...historicoSimulados.map(h => h.notaPercent));

        const categorias = ["Legislação de Trânsito", "Direção Defensiva", "Primeiros Socorros"];
        const desempenhoPorMateria = {};
        categorias.forEach(cat => {
            const simuladosMateria = historicoSimulados.filter(h =>
                h.categoria.toLowerCase() === cat.toLowerCase() ||
                (cat === "Legislação de Trânsito" && h.categoria === "Geral")
            );
            if (simuladosMateria.length > 0) {
                const soma = simuladosMateria.reduce((acc, curr) => acc + curr.notaPercent, 0);
                desempenhoPorMateria[cat] = Math.round(soma / simuladosMateria.length);
            } else {
                if (cat === "Legislação de Trânsito") desempenhoPorMateria[cat] = 78;
                if (cat === "Direção Defensiva") desempenhoPorMateria[cat] = 72;
                if (cat === "Primeiros Socorros") desempenhoPorMateria[cat] = 68;
            }
        });

        return res.json({
            simuladosRealizados,
            mediaAcertos,
            questoesRespondidas,
            melhorDesempenho,
            historico: historicoSimulados,
            desempenhoPorMateria
        });
    } catch (erro) {
        console.error('Erro ao obter desempenho:', erro);
        return res.status(500).json({ erro: 'Erro ao buscar métricas de desempenho.' });
    }
};

// PUT /api/perfil
export const atualizarPerfil = async (req, res) => {
    try {
        const usuarioId = Number(req.usuarioId);
        const dados = req.body || {};

        // Tenta atualizar via Prisma quando houver conexão com o DB
        try {
            const updateData = {};
            if (dados.nome) updateData.usuario_nome = dados.nome;
            if (dados.email) updateData.usuario_email = dados.email;
            if (dados.cpf) updateData.usuario_cpf = dados.cpf;
            if (dados.telefone) updateData.usuario_telefone = dados.telefone;

            if (Object.keys(updateData).length > 0) {
                await prisma.usuario.update({
                    where: { usuario_id: usuarioId },
                    data: updateData
                });
            }

            // Se houver dados do aluno, tenta atualizar também a tabela relacionada
            if (dados.aluno) {
                await prisma.aluno.update({
                    where: { aluno_usuario_id: usuarioId },
                    data: dados.aluno
                }).catch(() => {})
            }

            return res.json({ mensagem: 'Perfil atualizado com sucesso.' });
        } catch (errPrisma) {
            // Se o Prisma não estiver configurado, retorna os dados recebidos como confirmação
            console.warn('Prisma update falhou, retornando fallback:', errPrisma.message || errPrisma);
            return res.json({ mensagem: 'Perfil (mock) atualizado.', dadosRecebidos: dados });
        }
    } catch (erro) {
        console.error('Erro ao atualizar perfil:', erro);
        return res.status(500).json({ erro: 'Erro ao atualizar perfil.' });
    }
}

// GET /api/perfil/dashboard
export const obterDashboard = async (req, res) => {
    try {
        const usuarioId = Number(req.usuarioId);

        const usuario = await prisma.usuario.findUnique({
            where: { usuario_id: usuarioId },
            select: {
                usuario_nome: true,
                usuario_nivel_acesso: true,
                aluno: {
                    select: {
                        aluno_status_aluno: true,
                        aluno_categoria_pretendida: true,
                        simulados: {
                            select: {
                                aluno_simulado_nota_obtida: true,
                                aluno_simulado_data_realizacao: true,
                                simulado: {
                                    select: {
                                        simulado_titulo: true,
                                        simulado_nota_minima: true,
                                    }
                                }
                            }
                        },
                        cursos: {
                            select: {
                                aluno_curso_data_matricula: true,
                                curso: {
                                    select: {
                                        curso_titulo: true,
                                        curso_carga_horaria: true,
                                        aulas: {
                                            select: { aula_id: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        // Dados reais de simulados do banco
        const simuladosRealizados = usuario.aluno?.simulados ?? [];
        const totalSimulados = simuladosRealizados.length;
        const mediaAcertos = totalSimulados > 0
            ? Math.round(
                simuladosRealizados.reduce((acc, s) => acc + Number(s.aluno_simulado_nota_obtida ?? 0), 0)
                / totalSimulados
              )
            : 0;

        // Fallback para dados mockados enquanto o banco não tem histórico real
        const historicoFinal = totalSimulados > 0
            ? simuladosRealizados.map(s => ({
                titulo: s.simulado.simulado_titulo,
                nota: Number(s.aluno_simulado_nota_obtida),
                notaMinima: Number(s.simulado.simulado_nota_minima),
                data: s.aluno_simulado_data_realizacao,
                aprovado: Number(s.aluno_simulado_nota_obtida) >= Number(s.simulado.simulado_nota_minima),
            }))
            : historicoSimulados.map(h => ({
                titulo: `Simulado #${h.id}`,
                nota: h.notaPercent,
                notaMinima: 70,
                data: h.data,
                aprovado: h.notaPercent >= 70,
                acertos: h.acertos,
                total: h.total,
                categoria: h.categoria,
            }));

        return res.json({
            usuario: {
                nome: usuario.usuario_nome,
                nivel: usuario.usuario_nivel_acesso,
            },
            resumo: {
                simuladosRealizados: totalSimulados > 0 ? totalSimulados : historicoSimulados.length,
                mediaAcertos: totalSimulados > 0 ? mediaAcertos : 78,
                aulasAssistidas: aulasMock.reduce((acc, a) => acc + a.aulasConcluidas, 0),
                aulasTotais: aulasMock.reduce((acc, a) => acc + a.aulasTotais, 0),
            },
            historico: historicoFinal,
            cursos: aulasMock,
        });
    } catch (erro) {
        console.error('Erro ao obter dashboard:', erro);
        return res.status(500).json({ erro: 'Erro ao buscar dados do dashboard.' });
    }
};