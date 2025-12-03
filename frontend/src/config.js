// API Configuration
export const API_CONFIG = {
  // For local development
  LOCAL_API: 'http://localhost:5000',
  
  // For production (update after deployment)
  PRODUCTION_API: process.env.REACT_APP_API_URL || 'https://ludomax-api.railway.app',
  
  // Mock mode for testing without backend
  USE_MOCK_DATA: process.env.REACT_APP_USE_MOCK === 'true',
  
  // Razorpay
  RAZORPAY_KEY: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_demo'
};

// Get current API URL
export const getApiUrl = () => {
  if (API_CONFIG.USE_MOCK_DATA) {
    return null; // Use mock data
  }
  return process.env.NODE_ENV === 'production' 
    ? API_CONFIG.PRODUCTION_API 
    : API_CONFIG.LOCAL_API;
};

// Mock user data for testing
export const MOCK_USER = {
  id: 'demo_user_123',
  name: 'Demo User',
  email: 'demo@ludomax.com',
  phone: '9876543210',
  wallet: {
    balance: 500,
    bonus: 50
  },
  referralCode: 'LUDO50MAX',
  stats: {
    gamesPlayed: 10,
    gamesWon: 5,
    totalEarnings: 250,
    totalDeposits: 500,
    totalWithdrawals: 0
  }
};

// Mock tournaments
export const MOCK_TOURNAMENTS = [
  {
    _id: '1',
    name: '🔥 Mega Tournament',
    description: 'Win big prizes!',
    entryFee: 100,
    prizePool: 100000,
    maxPlayers: 1000,
    currentPlayers: 847,
    status: 'upcoming',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
  },
  {
    _id: '2',
    name: '⚡ Speed Tournament',
    description: 'Fast-paced action!',
    entryFee: 50,
    prizePool: 50000,
    maxPlayers: 500,
    currentPlayers: 523,
    status: 'live',
    startTime: new Date()
  },
  {
    _id: '3',
    name: '🎯 Beginner Tournament',
    description: 'Perfect for beginners',
    entryFee: 10,
    prizePool: 10000,
    maxPlayers: 500,
    currentPlayers: 234,
    status: 'upcoming',
    startTime: new Date(Date.now() + 45 * 60 * 1000) // 45 mins from now
  }
];
