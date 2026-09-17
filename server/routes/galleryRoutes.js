const express = require('express');
const {
    getGalleryItems,
    createGalleryItem,
    deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
    .get(getGalleryItems)
    .post(protect, admin, upload.single('image'), createGalleryItem);

router.route('/:id')
    .delete(protect, admin, deleteGalleryItem);

module.exports = router;
