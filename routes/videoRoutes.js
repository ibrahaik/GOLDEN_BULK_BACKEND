const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Rutas de videos
router.get('/pendientes', videoController.getPendingVideos);
router.get('/', videoController.getAllVideos);
router.get('/:usuario_id/:reto_id', videoController.getVideoById);
router.post('/', videoController.createVideo);
router.put('/:id', videoController.updateVideo);
router.get('/estado/:reto_id/:usuario_id', videoController.getEstadoReto);
router.put('/aprobar/:usuario_id/:reto_id', videoController.aprobarVideo);
router.put('/suspender/:usuario_id/:reto_id', videoController.suspenderVideo);
router.delete('/:id', videoController.deleteVideo);
module.exports = router;
