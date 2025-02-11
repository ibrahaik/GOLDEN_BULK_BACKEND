const express = require('express');
const router = express.Router();
const comunidadController = require('../controllers/comunidadController');

// Rutas de las comunidades
router.get('/', comunidadController.getAllComunidades);
router.get('/:id', comunidadController.getComunidadById);
router.post('/', comunidadController.createComunidad);
router.put('/:id', comunidadController.updateComunidad);
router.delete('/:id', comunidadController.deleteComunidad);

module.exports = router;
