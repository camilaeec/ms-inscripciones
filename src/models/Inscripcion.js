const mongoose = require('mongoose');

const inscripcionSchema = new mongoose.Schema({
  estudianteId: { type: String, required: true },
  cursoId: { type: Number, required: true },
  estado: { type: String, default: 'activa' },
  metodoPago: String,
  monto: Number,
  progreso: {
    porcentaje: { type: Number, default: 0 },
    ultimaLeccionId: Number,
    leccionesCompletadas: [Number]
  }
}, { timestamps: true });

module.exports = mongoose.model('Inscripcion', inscripcionSchema);