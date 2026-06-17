import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { usuarios } from '../dadosMockados.js';

const JWT_SECRET = process.env.JWT_SECRET || 'cnh_facil_super_secret_key_2026_dev';

export const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!usuario) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        const token = jwt.sign(
            { id: usuario.id, cargo: usuario.cargo },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        // Omitir o hash da senha no retorno
        const { senhaHash, ...usuarioRetorno } = usuario;

        return res.json({
            mensagem: 'Login bem-sucedido',
            token,
            usuario: usuarioRetorno
        });
    } catch (erro) {
        console.error('Erro no login:', erro);
        return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};

export const registro = async (req, res) => {
    const { nome, email, senha, cargo, categoria } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
    }

    try {
        const emailExistente = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());

        if (emailExistente) {
            return res.status(400).json({ erro: 'E-mail já cadastrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const nextId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;

        const novoUsuario = {
            id: nextId,
            nome,
            email,
            senhaHash,
            cargo: cargo || 'ALUNO',
            categoria: categoria || 'B',
            descricao: '',
            cpf: '',
            dataNascimento: '',
            documentos: {
                exameMedico: 'Pendente',
                psicotecnico: 'Pendente',
                documentosLegais: 'Pendente'
            },
            jornada: {
                matricula: { concluido: true, data: new Date().toLocaleDateString('pt-BR') },
                cursoTeorico: { concluido: false, horas: 0 },
                exameTeorico: { concluido: false },
                aulasPraticas: { emAndamento: false, horasConcluidas: 0, horasTotais: 20 },
                exameFinal: { concluido: false }
            },
            financeiro: {
                valorTotal: 2500.00,
                valorPago: 0.00,
                faltaPagar: 2500.00,
                progressoPercent: 0,
                proximaParcela: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
            }
        };

        usuarios.push(novoUsuario);
        const { senhaHash: _, ...usuarioRetorno } = novoUsuario;

        return res.status(201).json({
            mensagem: 'Usuário registrado com sucesso',
            usuario: usuarioRetorno
        });
    } catch (erro) {
        console.error('Erro no registro:', erro);
        return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};