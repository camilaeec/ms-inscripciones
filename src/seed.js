const mongoose = require('mongoose');
const Inscripcion = require('./models/Inscripcion');

mongoose.connect('mongodb://mongo:27017/inscripciones');

const generarDatosPrueba = async () => {
  const inscripciones = [];
  
  for (let i = 0; i < 20000; i++) {
    inscripciones.push({
      estudianteId: `est${Math.floor(Math.random() * 1000)}`,
      cursoId: Math.floor(Math.random() * 50) + 1,
      estado: ['activa', 'completada', 'cancelada'][Math.floor(Math.random() * 3)],
      metodoPago: ['tarjeta', 'paypal', 'transferencia'][Math.floor(Math.random() * 3)],
      monto: Math.random() * 100 + 20,
      progreso: {
        porcentaje: Math.floor(Math.random() * 100),
        leccionesCompletadas: Array.from({length: Math.floor(Math.random() * 10)}, (_, i) => i + 1)
      }
    });
  }

  await Inscripcion.insertMany(inscripciones);
  console.log('20,000 registros insertados');
  process.exit();
};

generarDatosPrueba();
