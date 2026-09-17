const Order = require('../models/Order');

// In-memory store for MOCK_DATABASE=true
let MOCK_ORDERS_STORE = [
    {
        _id: 'o1',
        customerName: 'Eleanor Vance',
        customerEmail: 'eleanor@example.com',
        customerPhone: '+1 (555) 234-5678',
        deliveryAddress: '450 Lexington Ave, New York, NY',
        items: [
            { name: 'Handmade Truffle Pasta', price: 28, quantity: 2 },
            { name: 'Belgian Chocolate Lava Cake', price: 16, quantity: 1 }
        ],
        totalAmount: 72.00,
        status: 'preparing',
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
        _id: 'o2',
        customerName: 'Jonathan Hayes',
        customerEmail: 'jonathan@example.com',
        customerPhone: '+1 (555) 987-6543',
        deliveryAddress: '120 Broadway, New York, NY',
        items: [
            { name: 'Grilled Ribeye Steak', price: 48, quantity: 1 },
            { name: 'Drizzle Signature Berry Mocktail', price: 10, quantity: 2 }
        ],
        totalAmount: 68.00,
        status: 'ready',
        createdAt: new Date(Date.now() - 90 * 60 * 1000)
    }
];

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res, next) => {
    try {
        const { items, totalAmount, customerName, customerEmail, customerPhone, deliveryAddress } = req.body;

        if (!items || items.length === 0) {
            res.status(400);
            throw new Error('No order items');
        }

        if (process.env.MOCK_DATABASE === 'true') {
            const newOrder = {
                _id: 'o_' + Date.now().toString(),
                items,
                totalAmount: parseFloat(totalAmount) || items.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0),
                customerName: customerName || 'Guest Patron',
                customerEmail: customerEmail || 'guest@drizzle.com',
                customerPhone: customerPhone || 'N/A',
                deliveryAddress: deliveryAddress || 'Dine-in / Pickup',
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            MOCK_ORDERS_STORE.unshift(newOrder);
            return res.status(201).json({ success: true, data: newOrder });
        }

        const order = await Order.create({
            items,
            totalAmount,
            customerName,
            customerEmail,
            customerPhone,
            deliveryAddress,
        });

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
    try {
        if (process.env.MOCK_DATABASE === 'true') {
            return res.json({ success: true, count: MOCK_ORDERS_STORE.length, data: MOCK_ORDERS_STORE });
        }
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
    try {
        if (process.env.MOCK_DATABASE === 'true') {
            const index = MOCK_ORDERS_STORE.findIndex(o => o._id === req.params.id);
            if (index !== -1) {
                MOCK_ORDERS_STORE[index].status = req.body.status || MOCK_ORDERS_STORE[index].status;
                MOCK_ORDERS_STORE[index].updatedAt = new Date();
                return res.json({ success: true, data: MOCK_ORDERS_STORE[index] });
            }
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        order.status = req.body.status || order.status;
        const updatedOrder = await order.save();

        res.json({ success: true, data: updatedOrder });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (process.env.MOCK_DATABASE === 'true') {
            const index = MOCK_ORDERS_STORE.findIndex(o => o._id === id);
            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }
            MOCK_ORDERS_STORE.splice(index, 1);
            return res.json({ success: true, data: {} });
        }

        const order = await Order.findById(id);
        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        await order.deleteOne();
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
    deleteOrder,
};
