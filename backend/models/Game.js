const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['quick-match', 'tournament', 'practice'],
    required: true
  },
  entryFee: {
    type: Number,
    required: true
  },
  prizeAmount: {
    type: Number,
    required: true
  },
  players: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    color: String,
    position: Number
  }],
  winner: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    prize: Number
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'cancelled'],
    default: 'waiting'
  },
  gameState: {
    currentPlayer: Number,
    diceValue: Number,
    tokens: Object,
    moves: Array
  },
  startedAt: Date,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', gameSchema);
