import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const salt = await bcrypt.genSalt(10);
    const senhaHashAdmin = await bcrypt.hash('admin123', salt);
    const senhaHashAluno = await bcrypt.hash('aluno123', salt);

    await prisma.usuario.upsert({
        where: { usuario_email: 'admin@cnhfacil.com' },
        update: {
            usuario_nome: 'Administrador CNHFácil',
            usuario_cpf: '00000000001',
            usuario_senha: senhaHashAdmin,
            usuario_nivel_acesso: 'admin',
        },
        create: {
            usuario_nome: 'Administrador CNHFácil',
            usuario_cpf: '00000000001',
            usuario_email: 'admin@cnhfacil.com',
            usuario_senha: senhaHashAdmin,
            usuario_nivel_acesso: 'admin',
        },
    });

    await prisma.usuario.upsert({
        where: { usuario_email: 'aluno@cnhfacil.com' },
        update: {
            usuario_nome: 'Aluno CNHFácil',
            usuario_cpf: '00000000002',
            usuario_senha: senhaHashAluno,
            usuario_nivel_acesso: 'aluno',
        },
        create: {
            usuario_nome: 'Aluno CNHFácil',
            usuario_cpf: '00000000002',
            usuario_email: 'aluno@cnhfacil.com',
            usuario_senha: senhaHashAluno,
            usuario_nivel_acesso: 'aluno',
        },
    });
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
