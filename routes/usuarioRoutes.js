const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const verificarToken = require('../middlewares/auth');


router.post('/login', usuarioController.login);
router.post('/registro', usuarioController.crearUsuario);
router.post('/verificar', usuarioController.verificarUsuario);
router.get('/', usuarioController.obtenerUsuarios);
router.get('/me', verificarToken, usuarioController.obtenerUsuarioActual);
router.get('/:id', usuarioController.obtenerUsuarioPorId);

module.exports = router;
