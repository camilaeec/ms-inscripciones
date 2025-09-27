const Inscripcion = require('../models/Inscripcion');

// GET /inscripciones?estudianteId=...&cursoId=...
const getInscripciones = async (req, res) => {
  try {
    const { estudianteId, cursoId } = req.query;
    let query = {};
    if (estudianteId) query.estudianteId = estudianteId;
    if (cursoId) query.cursoId = cursoId;

    const inscripciones = await Inscripcion.find(query);
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /inscripciones
const createInscripcion = async (req, res) => {
  try {
    const inscripcion = new Inscripcion(req.body);
    await inscripcion.save();
    res.status(201).json(inscripcion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH /inscripciones/:id/progreso
const updateProgreso = async (req, res) => {
  try {
    const { id } = req.params;
    const { progreso } = req.body;

    const inscripcion = await Inscripcion.findByIdAndUpdate(
      id,
      { progreso },
      { new: true }
    );

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    res.json(inscripcion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getInscripciones,
  createInscripcion,
  updateProgreso
};