const express = require('express');
const mongoose = require('mongoose');
const inscripcionRoutes = require('./routes/inscripcionRoutes');
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/inscripciones';


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/inscripciones', inscripcionRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});