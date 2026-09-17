const MenuItem = require('../models/MenuItem');
const cloudinary = require('../config/cloudinary');

// Comprehensive In-memory store for MOCK_DATABASE=true (matching rich seed data)
let MOCK_MENU_STORE = [
    {
        _id: 'm1',
        name: 'Garden Bruschetta',
        description: 'Crisp crostini topped with heirloom tomatoes, fresh basil, garlic, and aged balsamic glaze.',
        category: 'Starters',
        price: 12,
        tags: ['Veg', 'Popular'],
        isVegetarian: true,
        isGlutenFree: false,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1572695157366-5e585e50d53c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        _id: 'm2',
        name: 'Crispy Calamari',
        description: 'Lightly fried squid rings served with house-made smoked paprika marinara and lemon wedge.',
        category: 'Starters',
        price: 16,
        tags: ['Spicy', 'Chef\'s Pick'],
        isVegetarian: false,
        isGlutenFree: false,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        _id: 'm3',
        name: 'French Onion Soup',
        description: 'Rich slow-simmered beef broth, caramelized sweet onions, topped with sourdough crouton and melted gruyere.',
        category: 'Starters',
        price: 14,
        tags: ['Popular'],
        isVegetarian: false,
        isGlutenFree: false,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        _id: 'm4',
        name: 'Grilled Ribeye Steak',
        description: '14oz prime cut, roasted garlic & rosemary herb butter, served with charred broccolini and truffle jus.',
        category: 'Main Course',
        price: 48,
        tags: ['Popular', "Chef's Pick"],
        isVegetarian: false,
        isGlutenFree: true,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        _id: 'm5',
        name: 'Handmade Truffle Pasta',
        description: 'Artisanal linguine tossed in wild forest mushroom cream sauce with fresh black truffle shavings and parmigiano reggiano.',
        category: 'Main Course',
        price: 28,
        tags: ['Veg', 'Popular'],
        isVegetarian: true,
        isGlutenFree: false,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        _id: 'm6',
        name: 'Herb-Roasted Organic Chicken',
        description: 'Half farm-raised chicken, lemon thyme jus reduction, served over buttery Yukon gold potato puree.',
        category: 'Main Course',
        price: 32,
        tags: ['Popular'],
        isVegetarian: false,
        isGlutenFree: true,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        _id: 'm7',
        name: 'Pan-Seared Atlantic Salmon',
        description: 'Crisp-skinned Atlantic salmon fillet, tender grilled asparagus, and a delicate lemon dill beurre blanc.',
        category: 'Seafood',
        price: 36,
        tags: ['Popular', 'Chef\'s Pick'],
        isVegetarian: false,
        isGlutenFree: true,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        _id: 'm8',
        name: 'Garlic Tiger Prawn Linguine',
        description: 'Succulent jumbo tiger prawns, sun-ripened cherry tomatoes, white wine reduction, and fresh red chili flakes.',
        category: 'Seafood',
        price: 34,
        tags: ['Spicy', 'New'],
        isVegetarian: false,
        isGlutenFree: false,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        _id: 'm9',
        name: 'Golden Quinoa Buddha Bowl',
        description: 'Fluffy tri-color quinoa, roasted spiced sweet potato, creamy avocado, crispy chickpeas, and house tahini dressing.',
        category: 'Vegan',
        price: 22,
        tags: ['Vegan', 'Popular'],
        isVegetarian: true,
        isGlutenFree: true,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        _id: 'm10',
        name: 'Roasted Portobello Vegan Wrap',
        description: 'Balsamic grilled portobello mushroom, baby spinach, charred bell peppers, and house vegan garlic aioli.',
        category: 'Vegan',
        price: 18,
        tags: ['Vegan'],
        isVegetarian: true,
        isGlutenFree: false,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        _id: 'm11',
        name: 'Belgian Chocolate Lava Cake',
        description: 'Warm dark chocolate sponge with a molten ganache center, served with Madagascan vanilla bean gelato.',
        category: 'Desserts',
        price: 16,
        tags: ['Popular', "Chef's Pick"],
        isVegetarian: true,
        isGlutenFree: false,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        _id: 'm12',
        name: 'Classic Vanilla Bean Crème Brûlée',
        description: 'Velvety vanilla bean custard beneath a hand-torched caramelized sugar crust, garnished with fresh berries.',
        category: 'Desserts',
        price: 14,
        tags: ['Popular'],
        isVegetarian: true,
        isGlutenFree: true,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1472555794301-8b3564aa7fb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        _id: 'm13',
        name: 'Drizzle Signature Berry Mocktail',
        description: 'Muddled wild forest blackberries, fresh mint leaves, organic lime juice, and botanical sparkling water.',
        category: 'Drinks',
        price: 10,
        tags: ['Vegan', 'Popular'],
        isVegetarian: true,
        isGlutenFree: true,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        _id: 'm14',
        name: 'Artisanal Single-Origin Pour Over',
        description: 'Locally roasted Ethiopian Yirgacheffe beans with notes of jasmine, bergamot, and delicate honey.',
        category: 'Drinks',
        price: 7,
        tags: ['New'],
        isVegetarian: true,
        isGlutenFree: true,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    }
];

// Helper to normalize category
const normalizeCategory = (cat) => {
    if (!cat) return 'Main Course';
    const c = cat.toLowerCase();
    if (c.includes('start') || c.includes('appetiz')) return 'Starters';
    if (c.includes('main') || c.includes('entree')) return 'Main Course';
    if (c.includes('vegan') || c.includes('plant')) return 'Vegan';
    if (c.includes('sea') || c.includes('fish')) return 'Seafood';
    if (c.includes('dessert') || c.includes('sweet')) return 'Desserts';
    if (c.includes('drink') || c.includes('bever') || c.includes('cocktail')) return 'Drinks';
    return cat;
};

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res, next) => {
    try {
        if (process.env.MOCK_DATABASE === 'true') {
            return res.json({ success: true, count: MOCK_MENU_STORE.length, data: MOCK_MENU_STORE });
        }
        const menuItems = await MenuItem.find({}).sort({ category: 1, name: 1 });
        res.json({ success: true, count: menuItems.length, data: menuItems });
    } catch (error) {
        next(error);
    }
};

// @desc    Get menu items by category
// @route   GET /api/menu/:category
// @access  Public
const getMenuItemsByCategory = async (req, res, next) => {
    try {
        const catParam = req.params.category.toLowerCase();
        if (process.env.MOCK_DATABASE === 'true') {
            const filtered = MOCK_MENU_STORE.filter(item =>
                item.category.toLowerCase() === catParam ||
                normalizeCategory(item.category).toLowerCase() === catParam
            );
            return res.json({ success: true, count: filtered.length, data: filtered });
        }
        const menuItems = await MenuItem.find({
            $or: [
                { category: req.params.category },
                { category: catParam }
            ]
        });
        res.json({ success: true, count: menuItems.length, data: menuItems });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res, next) => {
    try {
        const {
            name,
            description,
            category,
            price,
            isVegetarian,
            isGlutenFree,
            isAvailable,
            tags,
            image: directImageUrl
        } = req.body;

        let parsedTags = [];
        if (Array.isArray(tags)) {
            parsedTags = tags;
        } else if (typeof tags === 'string') {
            try {
                parsedTags = JSON.parse(tags);
            } catch {
                parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
            }
        }

        const isVeg = isVegetarian === true || isVegetarian === 'true';
        const isGF = isGlutenFree === true || isGlutenFree === 'true';
        const available = isAvailable === undefined ? true : (isAvailable === true || isAvailable === 'true');
        const finalCategory = normalizeCategory(category);
        const parsedPrice = parseFloat(price) || 0;

        let finalImageUrl = directImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';

        // Check if image file was uploaded
        if (req.file) {
            try {
                if (cloudinary?.uploader?.upload) {
                    const b64 = Buffer.from(req.file.buffer).toString('base64');
                    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
                    const result = await cloudinary.uploader.upload(dataURI, {
                        folder: 'drizzle/menu',
                    });
                    finalImageUrl = result.secure_url;
                }
            } catch (cloudErr) {
                console.warn('Cloudinary upload warning:', cloudErr.message);
            }
        }

        if (process.env.MOCK_DATABASE === 'true') {
            const newItem = {
                _id: 'm_' + Date.now().toString(),
                name: name || 'Untitled Dish',
                description: description || '',
                category: finalCategory,
                price: parsedPrice,
                tags: parsedTags.length ? parsedTags : (isVeg ? ['Veg'] : []),
                isVegetarian: isVeg,
                isGlutenFree: isGF,
                isAvailable: available,
                image: finalImageUrl,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            MOCK_MENU_STORE.unshift(newItem);
            return res.status(201).json({ success: true, data: newItem });
        }

        // MongoDB Model mapping
        const itemData = {
            name,
            description,
            category: finalCategory.toLowerCase().includes('main') ? 'main' :
                      finalCategory.toLowerCase().includes('start') ? 'starter' :
                      finalCategory.toLowerCase().includes('vegan') ? 'vegan' :
                      finalCategory.toLowerCase().includes('sea') ? 'seafood' :
                      finalCategory.toLowerCase().includes('dessert') ? 'dessert' :
                      finalCategory.toLowerCase().includes('drink') ? 'drink' : 'main',
            price: parsedPrice,
            tags: parsedTags,
            image: finalImageUrl,
            isAvailable: available,
        };

        const menuItem = await MenuItem.create(itemData);
        res.status(201).json({ success: true, data: menuItem });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res, next) => {
    try {
        const id = req.params.id;
        const {
            name,
            description,
            category,
            price,
            isVegetarian,
            isGlutenFree,
            isAvailable,
            tags,
            image: directImageUrl
        } = req.body;

        let imageUrl = directImageUrl;

        // Handle image update if new file provided
        if (req.file) {
            try {
                if (cloudinary?.uploader?.upload) {
                    const b64 = Buffer.from(req.file.buffer).toString('base64');
                    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
                    const result = await cloudinary.uploader.upload(dataURI, {
                        folder: 'drizzle/menu',
                    });
                    imageUrl = result.secure_url;
                }
            } catch (cloudErr) {
                console.warn('Cloudinary upload warning:', cloudErr.message);
            }
        }

        if (process.env.MOCK_DATABASE === 'true') {
            const index = MOCK_MENU_STORE.findIndex(item => item._id === id);
            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Menu item not found' });
            }

            const current = MOCK_MENU_STORE[index];
            const updated = {
                ...current,
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(category && { category: normalizeCategory(category) }),
                ...(price !== undefined && { price: parseFloat(price) }),
                ...(isVegetarian !== undefined && { isVegetarian: isVegetarian === true || isVegetarian === 'true' }),
                ...(isGlutenFree !== undefined && { isGlutenFree: isGlutenFree === true || isGlutenFree === 'true' }),
                ...(isAvailable !== undefined && { isAvailable: isAvailable === true || isAvailable === 'true' }),
                ...(imageUrl && { image: imageUrl }),
                updatedAt: new Date(),
            };

            MOCK_MENU_STORE[index] = updated;
            return res.json({ success: true, data: updated });
        }

        let menuItem = await MenuItem.findById(id);
        if (!menuItem) {
            res.status(404);
            throw new Error('Menu item not found');
        }

        const itemData = { ...req.body };
        if (imageUrl) itemData.image = imageUrl;
        if (category) itemData.category = normalizeCategory(category).toLowerCase();
        if (price !== undefined) itemData.price = parseFloat(price);

        if (typeof req.body.tags === 'string') {
            try {
                itemData.tags = JSON.parse(req.body.tags);
            } catch {
                itemData.tags = req.body.tags.split(',').map(tag => tag.trim());
            }
        }

        menuItem = await MenuItem.findByIdAndUpdate(id, itemData, {
            new: true,
            runValidators: true,
        });

        res.json({ success: true, data: menuItem });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (process.env.MOCK_DATABASE === 'true') {
            const index = MOCK_MENU_STORE.findIndex(item => item._id === id);
            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Menu item not found' });
            }
            MOCK_MENU_STORE.splice(index, 1);
            return res.json({ success: true, data: {} });
        }

        const menuItem = await MenuItem.findById(id);
        if (!menuItem) {
            res.status(404);
            throw new Error('Menu item not found');
        }

        await menuItem.deleteOne();
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMenuItems,
    getMenuItemsByCategory,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
};
