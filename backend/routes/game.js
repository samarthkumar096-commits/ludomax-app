const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
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

// Create Game
router.post('/create', auth, async (req, res) => {
  try {
    const { type, entryFee } = req.body;
    const user = await User.findById(req.userId);

    // Check balance
    if (type !== 'practice' && user.wallet.balance < entryFee) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct entry fee
    if (type !== 'practice') {
      user.wallet.balance -= entryFee;
      await user.save();

      // Create transaction
      const transaction = new Transaction({
        userId: req.userId,
        type: 'game-entry',
        amount: entryFee,
        status: 'completed',
        description: `${type} game entry`
      });
      await transaction.save();
    }

    // Create game
    const game = new Game({
      gameId: `GAME_${Date.now()}`,
      type,
      entryFee,
      prizeAmount: type === 'practice' ? 10 : entryFee * 1.8,
      players: [{
        userId: req.userId,
        name: user.name,
        color: 'red',
        position: 0
      }],
      status: 'active',
      startedAt: new Date()
    });

    await game.save();

    res.json({ success: true, game });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete Game
router.post('/complete', auth, async (req, res) => {
  try {
    const { gameId, winnerId } = req.body;
    const game = await Game.findOne({ gameId });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    game.status = 'completed';
    game.completedAt = new Date();
    game.winner = {
      userId: winnerId,
      prize: game.prizeAmount
    };
    await game.save();

    // Update winner's wallet
    const winner = await User.findById(winnerId);
    winner.wallet.balance += game.prizeAmount;
    winner.stats.gamesWon += 1;
    winner.stats.totalEarnings += game.prizeAmount;
    await winner.save();

    // Create win transaction
    const transaction = new Transaction({
      userId: winnerId,
      type: 'game-win',
      amount: game.prizeAmount,
      status: 'completed',
      description: `Won ${game.type} game`
    });
    await transaction.save();

    // Update all players stats
    for (const player of game.players) {
      const user = await User.findById(player.userId);
      user.stats.gamesPlayed += 1;
      await user.save();
    }

    res.json({ success: true, game, winner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Game History
router.get('/history', auth, async (req, res) => {
  try {
    const games = await Game.find({
      'players.userId': req.userId
    }).sort({ createdAt: -1 }).limit(20);

    res.json({ success: true, games });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
