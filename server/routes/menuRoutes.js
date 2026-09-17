const express = require('express');
const {
    getMenuItems,
    getMenuItemsByCategory,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
} = require('../controllers/menuController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
    .get(getMenuItems)
    .post(protect, admin, upload.single('image'), createMenuItem);

router.route('/:category')
    .get(getMenuItemsByCategory);

router.route('/:id')
    .put(protect, admin, upload.single('image'), updateMenuItem)
    .delete(protect, admin, deleteMenuItem);

module.exports = router;
