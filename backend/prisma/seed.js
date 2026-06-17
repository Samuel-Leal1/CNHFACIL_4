import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.usuario.createMany({
        data: [
            {
                usuario_nome: 'Aluno Exemplo',
                usuario_cpf: '12345678901',
                usuario_email: 'aluno@exemplo.com',
                usuario_senha: 'senha123',
                usuario_nivel_acesso: 'aluno',
            },
            {
                usuario_nome: 'Admin Exemplo',
                usuario_cpf: '10987654321',
                usuario_email: 'admin@exemplo.com',
                usuario_senha: 'senha123',
                usuario_nivel_acesso: 'admin',
            },
        ],
        skipDuplicates: true,
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