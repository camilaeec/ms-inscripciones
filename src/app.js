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

// Configuración Swagger DINÁMICA
const getSwaggerOptions = () => {
  const productionUrl = process.env.EC2_IP 
    ? `http://${process.env.EC2_IP}:3000` 
    : 'http://[IP_EC2]:3000';

  return {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'MS Inscripciones API',
        version: '1.0.0',
        description: 'Microservicio para gestión de inscripciones estudiantiles',
      },
      servers: [
        { 
          url: 'http://localhost:3000', 
          description: 'Servidor Local' 
        },
        { 
          url: productionUrl, 
          description: 'Servidor Producción' 
        }
      ],
    },
    apis: ['./src/routes/*.js'],
  };
};

const swaggerSpec = swaggerJsdoc(getSwaggerOptions());
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
  res.json({ 
    status: 'OK', 
    message: 'MS Inscripciones funcionando',
    environment: process.env.NODE_ENV || 'development',
    ec2_ip: process.env.EC2_IP || 'no-configurada'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
  console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`🌐 Producción: http://${process.env.EC2_IP || 'IP_NO_CONFIGURADA'}:${PORT}/api-docs`);
});