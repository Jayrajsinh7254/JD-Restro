const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const BlogPost = require('./models/BlogPost');
const GalleryItem = require('./models/GalleryItem');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const menuItems = [
    {
        name: 'Garden Bruschetta',
        description: 'Crisp crostini topped with fresh tomatoes, basil, garlic, and balsamic glaze.',
        category: 'starter',
        price: 12,
        tags: ['Veg', 'Popular'],
        image: 'https://images.unsplash.com/photo-1572695157366-5e585e50d53c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Crispy Calamari',
        description: 'Lightly fried squid rings served with house-made marinara and lemon wedge.',
        category: 'starter',
        price: 16,
        tags: ['Spicy', 'New'],
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'French Onion Soup',
        description: 'Rich beef broth, caramelized onions, topped with croutons and melted gruyere.',
        category: 'starter',
        price: 14,
        tags: ['Popular'],
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Grilled Ribeye',
        description: '14oz premium cut, garlic herb butter, served with roasted root vegetables.',
        category: 'main',
        price: 48,
        tags: ['Popular', "Chef's Pick"],
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Roasted Chicken',
        description: 'Half farm-raised chicken, lemon thyme jus, served with creamy mash.',
        category: 'main',
        price: 32,
        tags: ['Popular'],
        image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Truffle Pasta',
        description: 'Handmade linguine tossed in wild mushroom cream sauce with black truffle shavings.',
        category: 'main',
        price: 28,
        tags: ['New'],
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Buddha Bowl',
        description: 'Quinoa, roasted sweet potato, avocado, kale, chickpeas with tahini dressing.',
        category: 'vegan',
        price: 22,
        tags: ['Vegan', 'Popular'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Veggie Wrap',
        description: 'Grilled portobello, spinach, roasted red peppers, vegan aioli in spinach tortilla.',
        category: 'vegan',
        price: 18,
        tags: ['Vegan'],
        image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Pan-Seared Salmon',
        description: 'Atlantic salmon fillet, asparagus, lemon dill beurre blanc sauce.',
        category: 'seafood',
        price: 36,
        tags: ['Popular'],
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Garlic Prawn Linguine',
        description: 'Tiger prawns, cherry tomatoes, white wine garlic sauce, touch of chili.',
        category: 'seafood',
        price: 34,
        tags: ['Spicy', 'New'],
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Crème Brûlée',
        description: 'Classic vanilla bean custard with caramelized sugar crust.',
        category: 'dessert',
        price: 14,
        tags: ['Popular'],
        image: 'https://images.unsplash.com/photo-1472555794301-8b3564aa7fb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center, served with vanilla bean ice cream.',
        category: 'dessert',
        price: 16,
        tags: ['Popular', "Chef's Pick"],
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Signature Mocktail',
        description: 'Muddled fresh berries, mint, lime juice, topped with sparkling water.',
        category: 'drink',
        price: 10,
        tags: ['Vegan', 'Popular'],
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        name: 'Artisan Coffee',
        description: 'Locally roasted single-origin beans, prepared to order.',
        category: 'drink',
        price: 7,
        tags: ['New'],
        image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
];

const blogPosts = [
    {
        title: 'Truffle Pasta at Home',
        slug: 'truffle-pasta-at-home',
        category: 'Recipe',
        excerpt: 'Learn the secret to making our famous truffle pasta in your own kitchen.',
        content: '<p>Truffles are a delicacy that can elevate any dish...</p>',
        headerImage: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        author: 'Chef Marco',
    },
    {
        title: 'Zero-Waste Kitchen',
        slug: 'zero-waste-kitchen',
        category: 'Sustainability',
        excerpt: 'How Drizzle is leading the charge in sustainable fine dining.',
        content: '<p>Our commitment to the environment starts in the kitchen...</p>',
        headerImage: 'https://images.unsplash.com/photo-1605652618956-628d05ee0f32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Wine Pairing Guide',
        slug: 'wine-pairing-guide',
        category: 'Wine & Dine',
        excerpt: 'Our sommelier shares tips on pairing wine with our robust menu.',
        content: '<p>Pairing the perfect wine can seem daunting, but...</p>',
        headerImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        author: 'Claire Dupont',
    },
    {
        title: 'Sofia\'s Story',
        slug: 'sofias-story',
        category: 'Behind the Scenes',
        excerpt: 'Meet our Co-Founder and Pastry Chef, Sofia Rivera.',
        content: '<p>From a small town in Italy to the bustling streets of New York...</p>',
        headerImage: 'https://images.unsplash.com/photo-1583338917451-fade2751d3b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Private Dining Tips',
        slug: 'private-dining-tips',
        category: 'Events',
        excerpt: 'How to plan the perfect corporate event or private celebration.',
        content: '<p>Our private dining spaces offer the perfect backdrop...</p>',
        headerImage: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Perfect Sear Secret',
        slug: 'perfect-sear-secret',
        category: 'Recipe',
        excerpt: 'Chef Marco reveals how to get a restaurant-quality sear on your steaks at home.',
        content: '<p>The secret is all in the temperature control and...</p>',
        headerImage: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        author: 'Chef Marco',
    },
];

const galleryImages = [
    { title: 'Ribeye Steak', category: 'food', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Lava Cake', category: 'food', imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Signature Cocktail', category: 'drinks', imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Wine Pour', category: 'drinks', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Main Dining Room', category: 'ambiance', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Patio Seating', category: 'ambiance', imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Wedding Reception', category: 'events', imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Corporate Dinner', category: 'events', imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Salmon Dish', category: 'food', imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Artisan Coffee', category: 'drinks', imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Chef Plating', category: 'ambiance', imageUrl: 'https://images.unsplash.com/photo-1583338917451-fade2751d3b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { title: 'Birthday Celebration', category: 'events', imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8892bf309c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

const importData = async () => {
    try {
        await User.deleteMany();
        await MenuItem.deleteMany();
        await BlogPost.deleteMany();
        await GalleryItem.deleteMany();

        // Create admin user
        await User.create({
            name: 'Admin User',
            email: 'admin@drizzle.com',
            password: 'Admin@123',
            role: 'admin',
        });

        // Insert data
        await MenuItem.insertMany(menuItems);
        await BlogPost.insertMany(blogPosts);
        await GalleryItem.insertMany(galleryImages);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await MenuItem.deleteMany();
        await BlogPost.deleteMany();
        await GalleryItem.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
