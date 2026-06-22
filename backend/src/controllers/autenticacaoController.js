import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../prismaClient.js';

const JWT_SECRET = process.env.JWT_SECRET || 'cnh_facil_super_secret_key_2026_dev';

export const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { usuario_email: email.toLowerCase() },
        });

        if (!usuario) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.usuario_senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        const token = jwt.sign(
            { id: usuario.usuario_id, nivelAcesso: usuario.usuario_nivel_acesso },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        // Omitir o hash da senha no retorno
        const { usuario_senha, ...usuarioRetorno } = usuario;

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
        const emailExistente = await prisma.usuario.findUnique({
            where: { usuario_email: email.toLowerCase() },
        });

        if (emailExistente) {
            return res.status(400).json({ erro: 'E-mail já cadastrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const novoUsuario = await prisma.usuario.create({
            data: {
                usuario_nome: nome,
                usuario_cpf: categoria ? categoria.slice(0, 11).padEnd(11, '0') : '00000000000',
                usuario_email: email.toLowerCase(),
                usuario_senha: senhaHash,
                usuario_nivel_acesso: (cargo || 'ALUNO').toLowerCase(),
            },
        });

        const { usuario_senha: _, ...usuarioRetorno } = novoUsuario;

        return res.status(201).json({
            mensagem: 'Usuário registrado com sucesso',
            usuario: usuarioRetorno
        });
    } catch (erro) {
        console.error('Erro no registro:', erro);
        return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};