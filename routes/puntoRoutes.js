const express = require('express');
const router = express.Router();
const puntosController = require('../controllers/puntoController');


router.get('/', puntosController.getAllPuntos);
router.post('/', puntosController.createPunto);
router.get('/balance/:usuario_id', puntosController.getBalance);

module.exports = router;