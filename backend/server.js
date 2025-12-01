const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ludomax', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/game', require('./routes/game'));
app.use('/api/tournament', require('./routes/tournament'));
app.use('/api/referral', require('./routes/referral'));

// Socket.io for real-time multiplayer
io.on('connection', (socket) => {
  console.log('🎮 New player connected:', socket.id);

  socket.on('join-game', (gameId) => {
    socket.join(gameId);
    console.log(`Player ${socket.id} joined game ${gameId}`);
  });

  socket.on('move-token', (data) => {
    io.to(data.gameId).emit('token-moved', data);
  });

  socket.on('roll-dice', (data) => {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    io.to(data.gameId).emit('dice-rolled', { 
      player: socket.id, 
      value: diceValue 
    });
  });

  socket.on('disconnect', () => {
    console.log('👋 Player disconnected:', socket.id);
  });
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: '🎲 LudoMax API Running',
    version: '1.0.0',
    status: 'active'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
