import bcrypt from 'bcryptjs';
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

        const simuladosAluno = await prisma.alunoSimulado.findMany({
            where: { aluno_id: usuarioId },
            include: {
                simulado: {
                    select: {
                        simulado_titulo: true,
                        simulado_nota_minima: true,
                    }
                }
            },
            orderBy: { aluno_simulado_data_realizacao: 'asc' },
        });

        // Usa dados reais do banco se existirem, senão usa mockados
        const historico = simuladosAluno.length > 0
            ? simuladosAluno.map((s, i) => ({
                id: i + 1,
                data: s.aluno_simulado_data_realizacao,
                notaPercent: Number(s.aluno_simulado_nota_obtida),
                notaObtida: Number(s.aluno_simulado_nota_obtida),
                simuladoTitulo: s.simulado.simulado_titulo,
                titulo: s.simulado.simulado_titulo,
                notaMinima: Number(s.simulado.simulado_nota_minima),
                acertos: s.aluno_simulado_acertos ?? Math.round(Number(s.aluno_simulado_nota_obtida) / 100 * (s.aluno_simulado_total ?? 30)),
                total: s.aluno_simulado_total ?? 30,
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
                    'Legislação de Trânsito': 0,
                    'Direção Defensiva': 0,
                    'Primeiros Socorros': 0,
                    'Meio Ambiente e Cidadania': 0,
                    'Mecânica Básica': 0,
                }
            });
        }

        const simuladosRealizados = historico.length;
        const totalNotas = historico.reduce((acc, curr) => acc + (curr.notaPercent ?? 0), 0);
        const mediaAcertos = Math.round(totalNotas / simuladosRealizados);
        const questoesRespondidas = historico.reduce((acc, curr) => acc + (curr.total ?? 30), 0);
        const totalAcertos = historico.reduce((acc, curr) => {
            const acertosItem = curr.acertos ?? Math.round((curr.notaPercent ?? 0) / 100 * (curr.total ?? 30));
            return acc + acertosItem;
        }, 0);
        const melhorDesempenho = Math.max(...historico.map(h => h.notaPercent ?? 0));

        // Desempenho por categoria: lê da tabela acumulativa (precisa questão a questão)
        const catRows = await prisma.alunoCategoriaDesempenho.findMany({
            where: { aluno_id: usuarioId },
        });

        let desempenhoPorMateria = {};
        if (catRows.length > 0) {
            catRows.forEach(row => {
                if (row.total > 0) {
                    desempenhoPorMateria[row.categoria] = Math.round((row.acertos / row.total) * 100);
                }
            });
        } else {
            // Fallback: deriva do histórico disponível (mock ou DB sem tabela de categorias)
            const categorias = ['Legislação de Trânsito', 'Direção Defensiva', 'Primeiros Socorros', 'Meio Ambiente e Cidadania', 'Mecânica Básica'];
            const sem = s => (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]/g, '');
            categorias.forEach(cat => {
                const catNorm = sem(cat);
                const simuladosMateria = historico.filter(h => {
                    const titulo = h.categoria || h.simuladoTitulo || h.titulo || '';
                    return sem(titulo) === catNorm;
                });
                if (simuladosMateria.length > 0) {
                    const soma = simuladosMateria.reduce((acc, curr) => acc + (curr.notaPercent ?? 0), 0);
                    desempenhoPorMateria[cat] = Math.round(soma / simuladosMateria.length);
                }
                // não inclui categoria se não há dados → frontend usa seu fallback
            });
        }

        return res.json({
            simuladosRealizados,
            mediaAcertos,
            questoesRespondidas,
            totalAcertos,
            melhorDesempenho,
            historico,
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

        const atual = await prisma.usuario.findUnique({
            where: { usuario_id: usuarioId },
            select: { usuario_email: true, usuario_nome: true, usuario_telefone: true },
        });

        if (!atual) return res.status(404).json({ erro: 'Usuário não encontrado.' });

        const updateData = {};

        if (dados.nome && dados.nome !== atual.usuario_nome) {
            updateData.usuario_nome = dados.nome;
        }
        if (dados.telefone !== undefined && dados.telefone !== atual.usuario_telefone) {
            updateData.usuario_telefone = dados.telefone || null;
        }

        if (dados.novaSenha) {
            if (dados.novaSenha.length < 8) {
                return res.status(400).json({ erro: 'A nova senha deve ter ao menos 8 caracteres.' });
            }
            if (dados.confirmarSenha !== dados.novaSenha) {
                return res.status(400).json({ erro: 'As novas senhas não coincidem.' });
            }
            const salt = await bcrypt.genSalt(10);
            updateData.usuario_senha = await bcrypt.hash(dados.novaSenha, salt);
        }

        // E-mail: só atualiza se mudou e não conflita com outro usuário
        if (dados.email && dados.email !== atual.usuario_email) {
            const conflito = await prisma.usuario.findFirst({
                where: { usuario_email: dados.email.toLowerCase(), NOT: { usuario_id: usuarioId } },
            });
            if (conflito) {
                return res.status(400).json({ erro: 'Este e-mail já está cadastrado em outra conta.' });
            }
            updateData.usuario_email = dados.email.toLowerCase();
        }

        if (Object.keys(updateData).length > 0) {
            await prisma.usuario.update({ where: { usuario_id: usuarioId }, data: updateData });
        }

        return res.json({ mensagem: 'Perfil atualizado com sucesso.' });
    } catch (erro) {
        console.error('Erro ao atualizar perfil:', erro);
        return res.status(500).json({ erro: 'Erro ao atualizar perfil.' });
    }
};

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
                                aluno_simulado_acertos: true,
                                aluno_simulado_total: true,
                                aluno_simulado_tentativas: true,
                                aluno_simulado_data_realizacao: true,
                                simulado: {
                                    select: {
                                        simulado_titulo: true,
                                        simulado_nota_minima: true,
                                    }
                                }
                            },
                            orderBy: { aluno_simulado_data_realizacao: 'desc' },
                        },
                        aulas: {
                            select: {
                                aula_id: true,
                                aula: { select: { aula_duracao_minutos: true } },
                            }
                        },
                    }
                }
            }
        });

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        // Aulas reais do aluno
        const aulasAluno = usuario.aluno?.aulas ?? [];
        const aulasAssistidas = aulasAluno.length;
        const aulasTotais = await prisma.aula.count();
        const progressoGeral = aulasTotais > 0 ? Math.round((aulasAssistidas / aulasTotais) * 100) : 0;
        const minutosEstudados = aulasAluno.reduce((acc, a) => acc + (a.aula?.aula_duracao_minutos ?? 20), 0);
        const tempoEstudo = (minutosEstudados / 60).toFixed(1);

        // Simulados reais do aluno
        const simuladosRealizados = usuario.aluno?.simulados ?? [];
        // Soma tentativas para contar cada execução, não só linhas únicas por categoria
        const totalSimulados = simuladosRealizados.reduce((acc, s) => acc + (s.aluno_simulado_tentativas ?? 1), 0);
        const mediaAcertos = simuladosRealizados.length > 0
            ? Math.round(
                simuladosRealizados.reduce((acc, s) => acc + Number(s.aluno_simulado_nota_obtida ?? 0), 0)
                / simuladosRealizados.length
              )
            : 0;

        // Histórico formatado para o frontend
        const historicoReal = totalSimulados > 0
            ? simuladosRealizados.slice(0, 6).map(s => {
                const nota = Number(s.aluno_simulado_nota_obtida ?? 0);
                const notaMinima = Number(s.simulado.simulado_nota_minima ?? 70);
                const aprovado = nota >= notaMinima;
                return {
                    titulo: s.simulado.simulado_titulo,
                    data: s.aluno_simulado_data_realizacao,
                    nota,
                    notaMinima,
                    aprovado,
                    pontuacao: s.aluno_simulado_acertos ?? Math.round(nota / 100 * (s.aluno_simulado_total ?? 30)),
                    total: s.aluno_simulado_total ?? 30,
                    status: aprovado ? 'Aprovado' : 'Reprovado',
                };
            })
            : historicoSimulados.map(h => ({
                titulo: `Simulado #${h.id}`,
                data: h.data,
                nota: h.notaPercent,
                notaMinima: 70,
                aprovado: h.notaPercent >= 70,
                pontuacao: h.acertos,
                total: h.total,
                status: h.notaPercent >= 70 ? 'Aprovado' : 'Reprovado',
                acertos: h.acertos,
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
                aulasAssistidas,
                aulasTotais: aulasTotais > 0 ? aulasTotais : aulasMock.reduce((a, c) => a + c.aulasTotais, 0),
                progressoGeral,
                tempoEstudo,
            },
            historico: historicoReal,
        });
    } catch (erro) {
        console.error('Erro ao obter dashboard:', erro);
        return res.status(500).json({ erro: 'Erro ao buscar dados do dashboard.' });
    }
};

// GET /api/admin/alunos
export const listarAlunos = async (req, res) => {
    try {
        const alunos = await prisma.aluno.findMany({
            include: {
                usuario: {
                    select: {
                        usuario_nome: true,
                        usuario_cpf: true,
                        usuario_email: true,
                    }
                },
                cursos: {
                    include: {
                        curso: { select: { curso_titulo: true, aulas: { select: { aula_id: true } } } }
                    }
                },
                aulas: { select: { aula_id: true } },
            }
        });

        const resultado = alunos.map(a => {
            const totalAulas = a.cursos.reduce((acc, ac) => acc + ac.curso.aulas.length, 0);
            const progresso = totalAulas > 0 ? Math.round((a.aulas.length / totalAulas) * 100) : 0;
            const iniciais = a.usuario.usuario_nome
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map(p => p[0].toUpperCase())
                .join('');
            return {
                id: iniciais || String(a.aluno_id),
                nome: a.usuario.usuario_nome,
                cpf: a.usuario.usuario_cpf,
                email: a.usuario.usuario_email,
                categoria: a.aluno_categoria_pretendida,
                progresso,
                status: a.aluno_status_aluno === 'ativo' ? 'Ativo' : 'Pendente',
                veiculo: 'Não associado',
                tipoVeiculo: null,
            };
        });

        return res.json(resultado);
    } catch (erro) {
        console.error('Erro ao listar alunos:', erro);
        return res.status(500).json({ erro: 'Erro ao buscar alunos.' });
    }
};

// GET /api/instrutores
export const listarInstrutores = async (req, res) => {
    try {
        const instrutores = await prisma.instrutor.findMany({
            include: {
                usuario: {
                    select: {
                        usuario_nome: true,
                        usuario_telefone: true,
                        usuario_foto_perfil: true,
                    }
                },
                veiculos: {
                    select: { veiculo_marca_modelo: true, veiculo_placa: true }
                }
            }
        });

        if (instrutores.length === 0) {
            return res.json([]);
        }

        const resultado = instrutores.map((inst, i) => {
            const veiculo = inst.veiculos.length > 0
                ? `${inst.veiculos[0].veiculo_marca_modelo} (${inst.veiculos[0].veiculo_placa})`
                : 'Frota Diversa';
            const avatares = ['👨', '👩', '👨‍🦱', '👩‍🦰', '👨‍🦳', '🧔'];
            return {
                id: inst.instrutor_id,
                nome: inst.usuario.usuario_nome,
                avaliacao: 5.0,
                avaliacoes: 0,
                categorias: [inst.instrutor_categoria_cnh],
                veiculo,
                bio: `Instrutor credenciado com categoria ${inst.instrutor_categoria_cnh}.`,
                avatar: avatares[i % avatares.length],
                whatsapp: inst.usuario.usuario_telefone?.replace(/\D/g, '') || '',
            };
        });

        return res.json(resultado);
    } catch (erro) {
        console.error('Erro ao listar instrutores:', erro);
        return res.status(500).json({ erro: 'Erro ao buscar instrutores.' });
    }
};
