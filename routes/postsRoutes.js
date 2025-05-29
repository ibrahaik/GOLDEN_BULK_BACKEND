const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

router.get('/', postsController.getAllPosts);
router.post('/', postsController.createPost);
router.get('/:id', postsController.getPostById);
router.delete('/:id', postsController.deletePost);

module.exports = router;
