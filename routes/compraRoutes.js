const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');

router.post('/' , compraController.comprarProducto);
router.get('/:usuario_id', compraController.getComprasPorUsuario);


module.exports = router;
