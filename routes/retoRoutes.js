const express = require('express');
const router = express.Router();
const retoController = require('../controllers/retoController');

// Rutas de los retos
router.get('/', retoController.getAllRetos);
router.get('/:id', retoController.getRetoById);
router.post('/', retoController.createReto);
router.put('/:id', retoController.updateReto);
router.delete('/:id', retoController.deleteReto);

module.exports = router;
