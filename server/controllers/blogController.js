const BlogPost = require('../models/BlogPost');
const cloudinary = require('../config/cloudinary');

// Rich In-memory store for MOCK_DATABASE=true (matching seed articles)
let MOCK_BLOG_STORE = [
    {
        _id: 'b1',
        title: 'Mastering Handcrafted Truffle Pasta at Home',
        slug: 'mastering-handcrafted-truffle-pasta-at-home',
        category: 'Recipe',
        excerpt: 'Learn the foundational secrets to crafting silky, restaurant-quality truffle pasta in your own kitchen from Chef Marco.',
        content: `Truffles are a rare delicacy that can instantly elevate any dish into a culinary masterpiece. In this guide, Executive Chef Marco shares the traditional Italian techniques behind Drizzle's acclaimed black truffle linguine.\n\n### The Golden Rules of Fresh Pasta\n1. **Zero-00 Flour**: Always use Italian Tipo 00 flour for that silky bite and elasticity.\n2. **Egg Yolk Ratio**: For every 100g of flour, use one whole egg and one additional yolk for richer color and chew.\n3. **Gentle Emulsification**: Never overheat fresh truffle butter. Emulsify off the heat with starchy pasta water for a luscious velvet sauce.\n\nExperiment with freshly shaved Norcia black truffles or premium organic truffle carpaccio to finish. Bon Appétit!`,
        headerImage: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        author: 'Chef Marco Rossi',
        readTime: '5 min read',
        isPublished: true,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
        _id: 'b2',
        title: 'The Zero-Waste Kitchen: Sustainable Fine Dining',
        slug: 'the-zero-waste-kitchen-sustainable-fine-dining',
        category: 'Sustainability',
        excerpt: 'How Drizzle is leading the charge in conscious fine dining through regenerative sourcing and circular culinary practices.',
        content: `Our commitment to sustainability starts at the soil. Over 90% of our organic produce is harvested daily from local heirloom farms within a 50-mile radius.\n\nIn our kitchen, every trim finds purpose: vegetable peels become concentrated umami glazes, fish bones form delicate dashi broths, and citrus rinds are candied for artisanal desserts.\n\nJoin us as we prove that luxury dining and planetary stewardship can exist in perfect harmony.`,
        headerImage: 'https://images.unsplash.com/photo-1605652618956-628d05ee0f32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        author: 'Elena Vance',
        readTime: '4 min read',
        isPublished: true,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
        _id: 'b3',
        title: 'Sommelier\'s Guide: Art of Wine & Food Harmony',
        slug: 'sommeliers-guide-art-of-wine-and-food-harmony',
        category: 'Wine & Dine',
        excerpt: 'Head Sommelier Claire Dupont decodes the delicate chemistry of pairing rare vintages with robust seasonal flavors.',
        content: `Pairing the perfect bottle is not about rigid dogmas; it is about balance, acidity, and resonance.\n\nWhen pairing with our Grade A5 Wagyu or dry-aged ribeye, look for old-world Nebbiolo or a structured Bordeaux whose tannins slice through rich marbling while echoing earthy undertones.\n\nFor seafood and light pasta, crisp minerality like a Chablis Premier Cru brings freshness to every bite.`,
        headerImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        author: 'Claire Dupont',
        readTime: '6 min read',
        isPublished: true,
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
    {
        _id: 'b4',
        title: 'Behind the Pass: A Day in Chef Sofia’s Pastry Lab',
        slug: 'behind-the-pass-chef-sofias-pastry-lab',
        category: 'Behind the Scenes',
        excerpt: 'Take an exclusive glimpse into the morning rituals, tempering perfection, and pastry artistry of Co-Founder Sofia Rivera.',
        content: `Before the sun rises over the city, Sofia's pastry lab fills with the scent of browned butter, roasted hazelnuts, and melted Valrhona chocolate.\n\nEvery dessert at Drizzle represents days of testing. Our molten chocolate lava cake undergoes precise tempering at 31°C to ensure the center remains liquid at exactly 55°C when served tableside.`,
        headerImage: 'https://images.unsplash.com/photo-1583338917451-fade2751d3b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        author: 'Sofia Rivera',
        readTime: '7 min read',
        isPublished: true,
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
        _id: 'b5',
        title: 'Planning Unforgettable Private Celebrations',
        slug: 'planning-unforgettable-private-celebrations',
        category: 'Events',
        excerpt: 'How our concierge and event team transform private dining spaces into bespoke, memorable sensory experiences.',
        content: `From intimate candlelight anniversaries in our wine cellar to bespoke 50-guest corporate banquets, our private dining rooms offer custom curated menus, personalized cocktail menus, and dedicated sommelier service.`,
        headerImage: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        author: 'Drizzle Events Team',
        readTime: '4 min read',
        isPublished: true,
        publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    }
];

// Helper to create URL slug from title
const createSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || `post-${Date.now()}`;
};

// @desc    Get all published blog posts
// @route   GET /api/blog
// @access  Public
const getBlogPosts = async (req, res, next) => {
    try {
        if (process.env.MOCK_DATABASE === 'true') {
            const sorted = [...MOCK_BLOG_STORE].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
            return res.json({ success: true, count: sorted.length, data: sorted });
        }
        const posts = await BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 });
        res.json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single blog post by slug
// @route   GET /api/blog/slug/:slug
// @access  Public
const getBlogPostBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        if (process.env.MOCK_DATABASE === 'true') {
            const post = MOCK_BLOG_STORE.find(p => p.slug === slug || p._id === slug);
            if (!post) {
                return res.status(404).json({ success: false, message: 'Blog post not found' });
            }
            return res.json({ success: true, data: post });
        }
        const post = await BlogPost.findOne({ slug, isPublished: true });

        if (!post) {
            res.status(404);
            throw new Error('Blog post not found');
        }

        res.json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a blog post
// @route   POST /api/blog
// @access  Private/Admin
const createBlogPost = async (req, res, next) => {
    try {
        const {
            title,
            category,
            excerpt,
            content,
            author,
            headerImage: directImageUrl,
            image: altImageUrl,
            readTime
        } = req.body;

        let imageUrl = directImageUrl || altImageUrl || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop';

        // Upload image to cloudinary if provided as file
        if (req.file) {
            try {
                if (cloudinary?.uploader?.upload) {
                    const b64 = Buffer.from(req.file.buffer).toString('base64');
                    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
                    const result = await cloudinary.uploader.upload(dataURI, {
                        folder: 'drizzle/blog',
                    });
                    imageUrl = result.secure_url;
                }
            } catch (cloudErr) {
                console.warn('Cloudinary upload warning for blog:', cloudErr.message);
            }
        }

        const calculatedSlug = req.body.slug || createSlug(title || 'New Story');
        const calculatedExcerpt = excerpt || (content ? content.substring(0, 140) + '...' : 'An exciting new culinary story from Drizzle.');
        const wordCount = (content || '').split(/\s+/).length;
        const calculatedReadTime = readTime || `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

        if (process.env.MOCK_DATABASE === 'true') {
            const newPost = {
                _id: 'b_' + Date.now().toString(),
                title: title || 'Untitled Article',
                slug: calculatedSlug,
                category: category || 'Behind the Scenes',
                excerpt: calculatedExcerpt,
                content: content || '<p>Content coming soon...</p>',
                headerImage: imageUrl,
                author: author || 'Drizzle Team',
                readTime: calculatedReadTime,
                isPublished: true,
                publishedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            MOCK_BLOG_STORE.unshift(newPost);
            return res.status(201).json({ success: true, data: newPost });
        }

        const postData = {
            title,
            slug: calculatedSlug,
            category: category || 'Behind the Scenes',
            excerpt: calculatedExcerpt,
            content,
            headerImage: imageUrl,
            author: author || 'Drizzle Team',
            isPublished: true,
            publishedAt: new Date(),
        };

        const post = await BlogPost.create(postData);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
const updateBlogPost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const {
            title,
            category,
            excerpt,
            content,
            author,
            headerImage: directImageUrl,
            image: altImageUrl,
            readTime
        } = req.body;

        let imageUrl = directImageUrl || altImageUrl;

        // Update image if new file uploaded
        if (req.file) {
            try {
                if (cloudinary?.uploader?.upload) {
                    const b64 = Buffer.from(req.file.buffer).toString('base64');
                    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
                    const result = await cloudinary.uploader.upload(dataURI, {
                        folder: 'drizzle/blog',
                    });
                    imageUrl = result.secure_url;
                }
            } catch (cloudErr) {
                console.warn('Cloudinary upload warning for blog:', cloudErr.message);
            }
        }

        if (process.env.MOCK_DATABASE === 'true') {
            const index = MOCK_BLOG_STORE.findIndex(p => p._id === id);
            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Blog post not found' });
            }

            const current = MOCK_BLOG_STORE[index];
            const updated = {
                ...current,
                ...(title && { title }),
                ...(title && !req.body.slug && { slug: createSlug(title) }),
                ...(req.body.slug && { slug: req.body.slug }),
                ...(category && { category }),
                ...(excerpt && { excerpt }),
                ...(content && { content }),
                ...(author && { author }),
                ...(imageUrl && { headerImage: imageUrl }),
                ...(readTime && { readTime }),
                updatedAt: new Date(),
            };

            MOCK_BLOG_STORE[index] = updated;
            return res.json({ success: true, data: updated });
        }

        let post = await BlogPost.findById(id);
        if (!post) {
            res.status(404);
            throw new Error('Blog post not found');
        }

        const postData = { ...req.body };
        if (imageUrl) postData.headerImage = imageUrl;
        if (title && !req.body.slug) postData.slug = createSlug(title);

        post = await BlogPost.findByIdAndUpdate(id, postData, {
            new: true,
            runValidators: true,
        });

        res.json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
const deleteBlogPost = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (process.env.MOCK_DATABASE === 'true') {
            const index = MOCK_BLOG_STORE.findIndex(p => p._id === id);
            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Blog post not found' });
            }
            MOCK_BLOG_STORE.splice(index, 1);
            return res.json({ success: true, data: {} });
        }

        const post = await BlogPost.findById(id);
        if (!post) {
            res.status(404);
            throw new Error('Blog post not found');
        }

        await post.deleteOne();
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBlogPosts,
    getBlogPostBySlug,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
};
