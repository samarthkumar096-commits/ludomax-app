# 🚀 LudoMax Deployment Guide

## Complete Deployment Instructions

### 📋 Prerequisites

1. **GitHub Account** ✅ (Already created)
2. **Railway Account** - Sign up at [railway.app](https://railway.app)
3. **MongoDB Atlas** - Free tier at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
4. **Razorpay Account** - Sign up at [razorpay.com](https://razorpay.com)
5. **Vercel Account** (Optional for frontend) - [vercel.com](https://vercel.com)

---

## 🗄️ Step 1: Setup MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ludomax
   ```
5. Replace `<password>` with your actual password
6. Save this connection string for later

---

## 💳 Step 2: Setup Razorpay

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up and complete KYC
3. Go to Settings → API Keys
4. Generate Test Keys (for testing)
5. Copy:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret**
6. Save these for later

---

## 🚂 Step 3: Deploy Backend on Railway

### Method 1: Using Railway Dashboard (Recommended)

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository: `ludomax-app`
4. Railway will auto-detect and deploy

### Method 2: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### Add Environment Variables on Railway:

Go to your Railway project → Variables → Add these:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_random_string_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NODE_ENV=production
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Get Your Backend URL:

After deployment, Railway will give you a URL like:
```
https://ludomax-app-production.up.railway.app
```

Save this URL!

---

## 🌐 Step 4: Deploy Frontend on Vercel

### Method 1: Using Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set Root Directory: `frontend`
5. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app
   ```
6. Click "Deploy"

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Go to frontend folder
cd frontend

# Deploy
vercel

# Follow prompts and add environment variable when asked
```

---

## 🎨 Step 5: Add Logo to App

1. Download the generated logos from:
   - [Logo 1](https://nyc3.digitaloceanspaces.com/bhindi-drive/files/9201bc52-98ce-4286-a069-8e7aebe6a195/2025-12-01T15-26-45-935Z-097d5ea8-nano-banana-pro_1764602805736.jpg)
   - [Logo 2](https://nyc3.digitaloceanspaces.com/bhindi-drive/files/9201bc52-98ce-4286-a069-8e7aebe6a195/2025-12-01T15-26-46-225Z-9443b622-nano-banana-pro_1764602806107.jpg)

2. Add to `frontend/public/` folder as `logo.png`
3. Update `frontend/public/index.html`:
   ```html
   <link rel="icon" href="%PUBLIC_URL%/logo.png" />
   ```

---

## ✅ Step 6: Test Your App

1. **Backend Health Check:**
   ```
   https://your-railway-url.railway.app/
   ```
   Should return: `{"message":"🎲 LudoMax API Running"}`

2. **Frontend:**
   ```
   https://your-vercel-url.vercel.app
   ```
   Should show login page

3. **Test Registration:**
   - Create a new account
   - Check if ₹500 starting balance is added
   - Test referral code

4. **Test Payment (Test Mode):**
   - Use Razorpay test cards:
     - Card: 4111 1111 1111 1111
     - CVV: Any 3 digits
     - Expiry: Any future date

---

## 🔧 Troubleshooting

### Backend Issues:

**Error: Cannot connect to MongoDB**
- Check MongoDB connection string
- Ensure IP whitelist includes `0.0.0.0/0` in MongoDB Atlas

**Error: Razorpay keys invalid**
- Verify keys are correct
- Use test keys for testing, live keys for production

### Frontend Issues:

**Error: API calls failing**
- Check `REACT_APP_API_URL` is set correctly
- Ensure Railway backend is running
- Check CORS settings in backend

---

## 📱 Step 7: Mobile App (Optional)

To convert to mobile app:

1. **React Native:**
   ```bash
   npx react-native init LudoMaxMobile
   # Copy components and adapt for mobile
   ```

2. **PWA (Progressive Web App):**
   - Already configured in React
   - Users can "Add to Home Screen"

3. **Capacitor (Recommended):**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   npx cap add android
   npx cap add ios
   ```

---

## 🎯 Next Steps

1. **Enable Live Payments:**
   - Complete Razorpay KYC
   - Switch to live API keys
   - Test with real transactions

2. **Add More Features:**
   - Real multiplayer with Socket.io
   - Push notifications
   - Leaderboards
   - Chat system

3. **Marketing:**
   - Create social media pages
   - Run referral campaigns
   - Partner with influencers

4. **Legal:**
   - Add Terms & Conditions
   - Privacy Policy
   - Age verification (18+)
   - Check local gaming laws

---

## 📞 Support

For issues or questions:
- GitHub Issues: [Create Issue](https://github.com/samarthkumar096-commits/ludomax-app/issues)
- Email: support@ludomax.com

---

## 🎉 Congratulations!

Your LudoMax app is now live! 🚀

**Your URLs:**
- Backend: `https://your-railway-url.railway.app`
- Frontend: `https://your-vercel-url.vercel.app`
- GitHub: `https://github.com/samarthkumar096-commits/ludomax-app`

Share with friends and start earning! 💰
