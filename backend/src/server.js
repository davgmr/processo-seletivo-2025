const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const duvRoutes = require('./routes/duvRoutes');
const navioRoutes = require('./routes/navioRoutes');
const pessoaRoutes = require('./routes/pessoaRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança e logging
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api/duvs', duvRoutes);
app.use('/api/navios', navioRoutes);
app.use('/api/pessoas', pessoaRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'DUV API'
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.originalUrl} não existe nesta API`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check disponível em http://localhost:${PORT}/health`);
});

module.exports = app;