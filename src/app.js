const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const inscripcionRoutes = require('./routes/inscripcionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MS Inscripciones API',
      version: '1.0.0',
      description: 'Microservicio para gestión de inscripciones estudiantiles',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor Local' },
      { url: 'http://[IP_EC2]:3000', description: 'Servidor Producción' }
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// MongoDB Connection
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/inscripciones';
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error MongoDB:', err));

// Routes
app.use('/inscripciones', inscripcionRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'MS Inscripciones funcionando' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
  console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
});