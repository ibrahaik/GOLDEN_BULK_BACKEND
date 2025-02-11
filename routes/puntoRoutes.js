const express = require('express');
const router = express.Router();
const puntoController = require('../controllers/puntoController');

// Rutas de puntos
router.get('/', puntoController.getAllPuntos);
router.post('/', puntoController.createPunto);

module.exports = router;
