const express = require('express');
const router = express.Router();
const {
  getInscripciones,
  createInscripcion,
  updateProgreso
} = require('../controllers/inscripcionController');

router.get('/', getInscripciones);
router.post('/', createInscripcion);
router.patch('/:id/progreso', updateProgreso);

module.exports = router;