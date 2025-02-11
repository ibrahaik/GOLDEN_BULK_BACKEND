const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rutas usuarios

router.post('/', usuarioController.crearUsuario);
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioPorId);

module.exports = router;
