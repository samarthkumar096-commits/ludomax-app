const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
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

// Get All Tournaments
router.get('/list', async (req, res) => {
  try {
    const tournaments = await Tournament.find({
      status: { $in: ['upcoming', 'live'] }
    }).sort({ startTime: 1 });

    res.json({ success: true, tournaments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join Tournament
router.post('/join', auth, async (req, res) => {
  try {
    const { tournamentId } = req.body;
    const user = await User.findById(req.userId);
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    if (tournament.currentPlayers >= tournament.maxPlayers) {
      return res.status(400).json({ error: 'Tournament is full' });
    }

    if (user.wallet.balance < tournament.entryFee) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Check if already joined
    const alreadyJoined = tournament.players.some(
      p => p.userId.toString() === req.userId
    );
    if (alreadyJoined) {
      return res.status(400).json({ error: 'Already joined' });
    }

    // Deduct entry fee
    user.wallet.balance -= tournament.entryFee;
    await user.save();

    // Add player to tournament
    tournament.players.push({
      userId: req.userId,
      name: user.name,
      joinedAt: new Date()
    });
    tournament.currentPlayers += 1;
    await tournament.save();

    // Create transaction
    const transaction = new Transaction({
      userId: req.userId,
      type: 'game-entry',
      amount: tournament.entryFee,
      status: 'completed',
      description: `Joined tournament: ${tournament.name}`
    });
    await transaction.save();

    res.json({ success: true, tournament });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Tournament (Admin)
router.post('/create', async (req, res) => {
  try {
    const { name, description, entryFee, prizePool, maxPlayers, startTime } = req.body;

    const tournament = new Tournament({
      name,
      description,
      entryFee,
      prizePool,
      maxPlayers,
      startTime: new Date(startTime)
    });

    await tournament.save();

    res.json({ success: true, tournament });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
