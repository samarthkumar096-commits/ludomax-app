const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Get Referral Stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const referrals = await User.find({ referredBy: user.referralCode });

    const stats = {
      referralCode: user.referralCode,
      totalReferrals: referrals.length,
      totalEarned: referrals.length * 50,
      referrals: referrals.map(r => ({
        name: r.name,
        joinedAt: r.createdAt
      }))
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Daily Bonus
router.post('/daily-bonus', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const today = new Date().setHours(0, 0, 0, 0);
    const lastClaimed = user.dailyBonus.lastClaimed 
      ? new Date(user.dailyBonus.lastClaimed).setHours(0, 0, 0, 0)
      : 0;

    if (lastClaimed === today) {
      return res.status(400).json({ error: 'Already claimed today' });
    }

    // Calculate streak
    const yesterday = new Date(today - 86400000);
    if (lastClaimed === yesterday.getTime()) {
      user.dailyBonus.streak += 1;
    } else {
      user.dailyBonus.streak = 1;
    }

    // Calculate bonus
    const bonusAmount = Math.min(user.dailyBonus.streak * 10, 100);
    user.wallet.bonus += bonusAmount;
    user.dailyBonus.lastClaimed = new Date();
    await user.save();

    // Create transaction
    const transaction = new Transaction({
      userId: req.userId,
      type: 'bonus',
      amount: bonusAmount,
      status: 'completed',
      description: `Daily bonus - Day ${user.dailyBonus.streak}`
    });
    await transaction.save();

    res.json({ 
      success: true, 
      bonus: bonusAmount,
      streak: user.dailyBonus.streak,
      wallet: user.wallet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Spin Wheel
router.post('/spin-wheel', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const today = new Date().setHours(0, 0, 0, 0);
    const lastSpin = user.spinWheel.lastSpin 
      ? new Date(user.spinWheel.lastSpin).setHours(0, 0, 0, 0)
      : 0;

    // Reset spins if new day
    if (lastSpin !== today) {
      user.spinWheel.spinsLeft = 3;
    }

    if (user.spinWheel.spinsLeft <= 0) {
      return res.status(400).json({ error: 'No spins left today' });
    }

    // Random prize
    const prizes = [10, 50, 100, 500, 1000, 0];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];

    user.spinWheel.spinsLeft -= 1;
    user.spinWheel.lastSpin = new Date();

    if (prize > 0) {
      user.wallet.bonus += prize;
      
      const transaction = new Transaction({
        userId: req.userId,
        type: 'bonus',
        amount: prize,
        status: 'completed',
        description: 'Spin wheel reward'
      });
      await transaction.save();
    }

    await user.save();

    res.json({ 
      success: true, 
      prize,
      spinsLeft: user.spinWheel.spinsLeft,
      wallet: user.wallet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Watch Ad Reward
router.post('/ad-reward', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const reward = 2;

    user.wallet.bonus += reward;
    await user.save();

    const transaction = new Transaction({
      userId: req.userId,
      type: 'ad-reward',
      amount: reward,
      status: 'completed',
      description: 'Ad watch reward'
    });
    await transaction.save();

    res.json({ 
      success: true, 
      reward,
      wallet: user.wallet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
