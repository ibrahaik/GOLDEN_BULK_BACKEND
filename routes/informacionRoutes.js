const express = require('express');
const router = express.Router();
const InformacionController = require('../controllers/informacionController');

router.post('/', InformacionController.crearInformacion);
router.get('/:user_id', InformacionController.obtenerInformacionPorUsuario);
router.put('/:user_id', InformacionController.actualizarInformacion);


module.exports = router;
