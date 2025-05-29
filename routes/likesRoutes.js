const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likesController');

router.post('/', likesController.addLike);
router.get('/:postId', likesController.getLikesByPost);
router.delete('/', likesController.removeLike);

module.exports = router;
