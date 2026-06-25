import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar rotas
import authRoutes from './routes/autenticacaoRoutes.js';
import questionRoutes from './routes/questoesRoutes.js';
import simuladoRoutes from './routes/simuladoRoutes.js';
import perfilRoutes from './routes/perfilRoutes.js';
import veiculoRoutes from './routes/veiculoRoutes.js';
import aulaRoutes from './routes/aulaRoutes.js';

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Documentação da API com Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Redirecionamento da raiz para a documentação
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Registrar as Rotas
app.use('/api/auth', authRoutes);
app.use('/api/questoes', questionRoutes);
app.use('/api/simulados', simuladoRoutes);
app.use('/api/veiculos', veiculoRoutes);
app.use('/api/aulas', aulaRoutes);
app.use('/api', perfilRoutes); // Serve /api/perfil e /api/desempenho

// Tratamento de rotas inexistentes (404)
app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Tratamento de erros globais (500)
app.use((err, req, res, next) => {
    console.error('Erro interno:', err);
    res.status(500).json({ erro: 'Ocorreu um erro interno no servidor.' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 CNHFácil Backend iniciado com sucesso!`);
    console.log(`📡 Servidor rodando em: http://localhost:${PORT}`);
    console.log(`📄 Documentação Swagger em: http://localhost:${PORT}/api-docs`);
    console.log(`====================================================`);
});