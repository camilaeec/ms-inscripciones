const Inscripcion = require('../models/Inscripcion');

/**
 * @swagger
 * components:
 *   schemas:
 *     Inscripcion:
 *       type: object
 *       required:
 *         - estudianteId
 *         - cursoId
 *       properties:
 *         estudianteId:
 *           type: string
 *         cursoId:
 *           type: integer
 *         estado:
 *           type: string
 *           enum: [activa, completada, cancelada]
 *         metodoPago:
 *           type: string
 *         monto:
 *           type: number
 *         progreso:
 *           type: object
 *           properties:
 *             porcentaje:
 *               type: number
 *             leccionesCompletadas:
 *               type: array
 *               items:
 *                 type: number
 */

/**
 * @swagger
 * /inscripciones:
 *   get:
 *     summary: Obtener inscripciones
 *     parameters:
 *       - in: query
 *         name: estudianteId
 *         schema: { type: string }
 *       - in: query
 *         name: cursoId
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de inscripciones
 */
const getInscripciones = async (req, res) => {
  try {
    const { estudianteId, cursoId } = req.query;
    let query = {};
    if (estudianteId) query.estudianteId = estudianteId;
    if (cursoId) query.cursoId = parseInt(cursoId);

    const inscripciones = await Inscripcion.find(query);
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /inscripciones:
 *   post:
 *     summary: Crear inscripción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inscripcion'
 *     responses:
 *       201:
 *         description: Inscripción creada
 */
const createInscripcion = async (req, res) => {
  try {
    const inscripcion = new Inscripcion(req.body);
    await inscripcion.save();
    res.status(201).json(inscripcion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @swagger
 * /inscripciones/{id}/progreso:
 *   patch:
 *     summary: Actualizar progreso
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progreso:
 *                 type: object
 *     responses:
 *       200:
 *         description: Progreso actualizado
 */
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