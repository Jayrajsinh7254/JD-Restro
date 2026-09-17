const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        if (process.env.MOCK_DATABASE === 'true') {
            const validAdminEmails = ['admin@drizzle.com', 'admin@example.com', 'admin'];
            const validAdminPasswords = ['Admin@123', 'admin123', 'admin', 'password'];

            const isEmailMatch = validAdminEmails.includes(email.toLowerCase().trim());
            const isPasswordMatch = validAdminPasswords.includes(password);

            if (isEmailMatch && isPasswordMatch) {
                return res.json({
                    success: true,
                    data: {
                        _id: 'mock_admin_id',
                        name: 'Executive Admin',
                        email: email,
                        role: 'admin',
                        token: 'mock_token_123'
                    }
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials. Use admin@drizzle.com and Admin@123'
                });
            }
        }

        // MongoDB Authentication
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            if (user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access restricted to admin personnel only'
                });
            }

            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id),
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Register a new user (admin only)
// @route   POST /api/auth/register
// @access  Private/Admin
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (process.env.MOCK_DATABASE === 'true') {
            return res.status(201).json({
                success: true,
                data: {
                    _id: 'mock_user_' + Date.now(),
                    name: name || 'Admin User',
                    email: email,
                    role: role || 'admin',
                    token: 'mock_token_123'
                }
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'admin',
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id),
                }
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user / clear cookie if used
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
    authUser,
    registerUser,
    logoutUser,
};
