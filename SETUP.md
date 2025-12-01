# 🛠️ LudoMax Local Development Setup

## Quick Start Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/samarthkumar096-commits/ludomax-app.git
cd ludomax-app
```

### 2️⃣ Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3️⃣ Setup Environment Variables

#### Backend (.env)

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ludomax
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_secret
NODE_ENV=development
```

#### Frontend (.env)

Create `frontend/.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY=your_razorpay_test_key_id
```

### 4️⃣ Setup MongoDB

#### Option A: Local MongoDB

```bash
# Install MongoDB
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in backend/.env

### 5️⃣ Setup Razorpay (Optional for testing)

1. Sign up at [Razorpay](https://razorpay.com)
2. Get test API keys
3. Update keys in .env files

**For testing without Razorpay:**
- Comment out Razorpay code in `backend/routes/wallet.js`
- Wallet will work with mock data

### 6️⃣ Run the App

#### Terminal 1 - Backend:
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

Backend will run on: `http://localhost:5000`

#### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:3000`

### 7️⃣ Test the App

1. Open browser: `http://localhost:3000`
2. Register a new account
3. You'll get ₹500 starting balance
4. Try different game modes

---

## 🧪 Testing

### Create Test Users

```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@ludomax.com",
    "phone": "9876543210",
    "password": "test123"
  }'
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/

# Get tournaments
curl http://localhost:5000/api/tournament/list
```

---

## 📁 Project Structure

```
ludomax-app/
├── backend/
│   ├── models/          # MongoDB models
│   │   ├── User.js
│   │   ├── Game.js
│   │   ├── Transaction.js
│   │   └── Tournament.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── wallet.js
│   │   ├── game.js
│   │   ├── tournament.js
│   │   └── referral.js
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── Game.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

---

## 🐛 Common Issues

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod --dbpath /path/to/data
```

### CORS Errors

- Ensure backend CORS is configured for `http://localhost:3000`
- Check `backend/server.js` has `cors()` middleware

---

## 🔧 Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- MongoDB for VS Code
- Thunder Client (API testing)

### Useful Commands

```bash
# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm test

# Build frontend for production
cd frontend && npm run build
```

---

## 📚 API Documentation

### Authentication

**POST /api/auth/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "referralCode": "LUDO50MAX"
}
```

**POST /api/auth/login**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Wallet

**GET /api/wallet/balance**
Headers: `Authorization: Bearer <token>`

**POST /api/wallet/create-order**
```json
{
  "amount": 100
}
```

### Game

**POST /api/game/create**
```json
{
  "type": "quick-match",
  "entryFee": 50
}
```

---

## 🎯 Next Development Steps

1. **Implement Real Ludo Board**
   - Add complete board rendering
   - Token movement logic
   - Game rules implementation

2. **Add Socket.io Multiplayer**
   - Real-time game updates
   - Player matching system
   - Live tournaments

3. **Enhance UI/UX**
   - Animations
   - Sound effects
   - Better mobile responsiveness

4. **Add More Features**
   - Leaderboards
   - Chat system
   - Push notifications
   - KYC verification

---

## 📞 Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Create an issue on GitHub
- Contact: support@ludomax.com

Happy Coding! 🚀
