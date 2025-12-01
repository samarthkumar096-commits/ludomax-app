const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Middleware to verify token
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Create Razorpay Order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // Create transaction
    const transaction = new Transaction({
      userId: req.userId,
      type: 'deposit',
      amount,
      razorpayOrderId: order.id,
      status: 'pending'
    });
    await transaction.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Payment
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, amount } = req.body;

    // Update transaction
    const transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    transaction.status = 'completed';
    transaction.razorpayPaymentId = razorpay_payment_id;
    await transaction.save();

    // Update user wallet
    const user = await User.findById(req.userId);
    user.wallet.balance += amount;
    user.stats.totalDeposits += amount;

    // First deposit bonus (10%)
    if (user.stats.totalDeposits === amount && amount >= 100) {
      const bonus = Math.floor(amount * 0.1);
      user.wallet.bonus += bonus;
    }

    await user.save();

    res.json({ 
      success: true, 
      wallet: user.wallet,
      message: 'Payment successful'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Wallet Balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ success: true, wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Withdraw
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);

    if (user.wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create withdrawal transaction
    const transaction = new Transaction({
      userId: req.userId,
      type: 'withdrawal',
      amount,
      status: 'pending',
      description: 'Withdrawal request'
    });
    await transaction.save();

    user.wallet.balance -= amount;
    user.stats.totalWithdrawals += amount;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Withdrawal request submitted',
      wallet: user.wallet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
