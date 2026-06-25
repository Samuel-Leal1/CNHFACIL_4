import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cnh_facil_super_secret_key_2026_dev';

// Extrai o usuário se o token estiver presente, mas não bloqueia se não estiver
export const tokenOpcional = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) return next();
    try {
        const payload = jwt.verify(parts[1], JWT_SECRET);
        req.usuarioId = payload.id;
        req.cargoUsuario = payload.cargo || payload.nivelAcesso;
        req.usuarioNivelAcesso = payload.nivelAcesso || payload.cargo;
    } catch (_) {}
    return next();
};

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não fornecido.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ erro: 'Erro no formato do token.' });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ erro: 'Token malformatado.' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.usuarioId = payload.id;
        req.cargoUsuario = payload.cargo || payload.nivelAcesso;
        req.usuarioNivelAcesso = payload.nivelAcesso || payload.cargo;
        return next();
    } catch (erro) {
        return res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }
};