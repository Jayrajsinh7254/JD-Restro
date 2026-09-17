const express = require('express');
const {
    getBlogPosts,
    getBlogPostBySlug,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
} = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
    .get(getBlogPosts)
    .post(protect, admin, upload.single('headerImage'), createBlogPost);

router.route('/:id')
    .put(protect, admin, upload.single('headerImage'), updateBlogPost)
    .delete(protect, admin, deleteBlogPost);

router.route('/slug/:slug')
    .get(getBlogPostBySlug);

module.exports = router;
