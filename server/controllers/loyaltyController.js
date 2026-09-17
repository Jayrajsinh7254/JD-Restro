const LoyaltyMember = require('../models/LoyaltyMember');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new loyalty member
// @route   POST /api/loyalty/join
// @access  Public
const joinLoyalty = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;

        const memberExists = await LoyaltyMember.findOne({ email });

        if (memberExists) {
            res.status(400);
            throw new Error('Loyalty member already exists with this email');
        }

        // Give 500 points for joining
        const member = await LoyaltyMember.create({
            name,
            email,
            phone,
            points: 500,
            tier: 'silver',
            joinedAt: Date.now(),
            lastVisit: Date.now(),
        });

        // Send welcome email
        try {
            const message = `
        Dear ${member.name},
        
        Welcome to the Drizzle Loyalty Program!
        
        We've added 500 bonus points to your account just for joining.
        You are currently a Silver member. You can earn more points with every visit!
        
        As a member, you'll enjoy exclusive perks like priority booking and birthday rewards.
        
        Best regards,
        Drizzle Restaurant
      `;

            await sendEmail({
                email: member.email,
                subject: 'Welcome to Drizzle Loyalty! - 500 Bonus Points Inside',
                message,
            });
        } catch (err) {
            console.log('Email could not be sent', err);
        }

        res.status(201).json({ success: true, data: member });
    } catch (error) {
        next(error);
    }
};

// @desc    Get loyalty member by email
// @route   GET /api/loyalty/:email
// @access  Public
const getLoyaltyMember = async (req, res, next) => {
    try {
        const member = await LoyaltyMember.findOne({ email: req.params.email });

        if (!member) {
            res.status(404);
            throw new Error('Loyalty member not found');
        }

        res.json({ success: true, data: member });
    } catch (error) {
        next(error);
    }
};

// @desc    Add points to member
// @route   POST /api/loyalty/earn
// @access  Private/Admin
const earnPoints = async (req, res, next) => {
    try {
        const { email, amountSpent } = req.body;

        // 10 points per dollar spent
        const pointsToEarn = Math.floor(amountSpent * 10);

        let member = await LoyaltyMember.findOne({ email });

        if (!member) {
            res.status(404);
            throw new Error('Loyalty member not found');
        }

        member.points += pointsToEarn;
        member.lastVisit = Date.now();

        // Tier progression logic
        if (member.points >= 5000 && member.tier !== 'platinum') {
            member.tier = 'platinum';
        } else if (member.points >= 2000 && member.tier === 'silver') {
            member.tier = 'gold';
        }

        await member.save();

        res.json({ success: true, data: member, pointsEarned: pointsToEarn });
    } catch (error) {
        next(error);
    }
};

// @desc    Redeem points
// @route   POST /api/loyalty/redeem
// @access  Private/Admin
const redeemPoints = async (req, res, next) => {
    try {
        const { email, pointsToRedeem } = req.body;

        let member = await LoyaltyMember.findOne({ email });

        if (!member) {
            res.status(404);
            throw new Error('Loyalty member not found');
        }

        if (member.points < pointsToRedeem) {
            res.status(400);
            throw new Error(`Insufficient points. Member only has ${member.points} points.`);
        }

        member.points -= pointsToRedeem;
        await member.save();

        res.json({ success: true, data: member, pointsRedeemed: pointsToRedeem });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    joinLoyalty,
    getLoyaltyMember,
    earnPoints,
    redeemPoints,
};
