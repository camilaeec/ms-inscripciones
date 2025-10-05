const express = require('express');
const router = express.Router();
const {
  getInscripciones,
  createInscripcion,
  updateProgreso,
  getInscripcionByEstudianteAndCurso
} = require('../controllers/inscripcionController');

/**
 * @swagger
 * tags:
 *   name: Inscripciones
 *   description: Gestión de inscripciones estudiantiles
 */

router.get('/', getInscripciones);
router.get('/:estudianteId/:cursoId', getInscripcionByEstudianteAndCurso);
router.post('/', createInscripcion);
router.patch('/:id/progreso', updateProgreso);

module.exports = router;