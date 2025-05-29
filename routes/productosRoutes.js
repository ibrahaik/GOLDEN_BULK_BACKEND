const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productoController');

router.get('/', productosController.obtenerProductos);
router.get('/:id', productosController.obtenerProductoPorId)
router.post('/', productosController.crearProducto);
router.put('/:id', productosController.actualizarProducto);

module.exports = router;
