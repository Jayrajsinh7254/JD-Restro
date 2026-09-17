const GalleryItem = require('../models/GalleryItem');
const cloudinary = require('../config/cloudinary');

// In-memory store for MOCK_DATABASE=true
let MOCK_GALLERY_STORE = [
    { _id: 'g1', title: 'Elegant Interior', category: 'ambiance', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop' },
    { _id: 'g2', title: 'Signature Dish', category: 'food', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop' }
];

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res, next) => {
    try {
        if (process.env.MOCK_DATABASE === 'true') {
            const category = req.query.category;
            const filtered = category ? MOCK_GALLERY_STORE.filter(i => i.category === category) : MOCK_GALLERY_STORE;
            return res.json({ success: true, count: filtered.length, data: filtered });
        }
        // Add filtering by category if provided in query string
        const query = req.query.category ? { category: req.query.category } : {};

        const items = await GalleryItem.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: items.length, data: items });
    } catch (error) {
        next(error);
    }
};

// @desc    Create/Upload a gallery image
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = async (req, res, next) => {
    try {
        if (process.env.MOCK_DATABASE === 'true') {
            const newItem = {
                _id: 'g' + Date.now().toString(), // Ensure _id works consistently with UI
                title: req.body.title || 'Untitled',
                category: req.body.category || 'Interior',
                imageUrl: req.file ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop' : (req.body.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop')
            };
            MOCK_GALLERY_STORE.push(newItem);
            return res.status(201).json({ success: true, data: newItem });
        }
        const { category, title } = req.body;
        let imageUrl = '';
        let cloudinaryId = '';

        // Check if image file was uploaded
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;

            const result = await cloudinary.uploader.upload(dataURI, {
                folder: 'drizzle/gallery',
            });
            imageUrl = result.secure_url;
            cloudinaryId = result.public_id;
        } else if (req.body.imageUrl) {
            // Allow passing direct URL for seeding
            imageUrl = req.body.imageUrl;
        } else {
            res.status(400);
            throw new Error('Please provide an image file');
        }

        const item = await GalleryItem.create({
            title,
            category,
            imageUrl,
            cloudinaryId,
        });

        res.status(201).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = async (req, res, next) => {
    try {
        if (process.env.MOCK_DATABASE === 'true') {
            const id = req.params.id;
            const index = MOCK_GALLERY_STORE.findIndex(i => i._id === id || i._id.toString() === id.toString());

            if (index === -1) {
                res.status(404);
                throw new Error('Gallery item not found in Mock Store');
            }

            MOCK_GALLERY_STORE.splice(index, 1);
            return res.json({ success: true, data: {} });
        }

        const item = await GalleryItem.findById(req.params.id);

        if (!item) {
            res.status(404);
            throw new Error('Gallery item not found');
        }

        // Delete image from cloudinary if it exists
        if (item.cloudinaryId) {
            await cloudinary.uploader.destroy(item.cloudinaryId);
        }

        await item.deleteOne();
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getGalleryItems,
    createGalleryItem,
    deleteGalleryItem,
};
