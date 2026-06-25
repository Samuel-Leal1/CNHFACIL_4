import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API CNHFácil',
            version: '1.0.0',
            description: 'Documentação oficial das APIs do sistema CNHFácil. Inclui autenticação, gerenciamento de questões do DETRAN, simulados, veículos, aulas e desempenho.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local de Desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Encontra anotações de swagger nas rotas
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;