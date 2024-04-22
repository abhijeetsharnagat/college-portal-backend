const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes for posts
router.post('/create', authMiddleware, postController.createPost);
router.get('/all', postController.getAllPosts);
router.put('/like/:postId', authMiddleware, postController.likePost);
router.post('/comment/:postId', authMiddleware, postController.commentOnPost);

module.exports = router;