# 📱 Quick APK Build - LudoMax

## 🚀 Fastest Way to Build APK (Without Backend)

### Method 1: Using APK Builder Online (5 minutes) ⚡ EASIEST

#### Step 1: Build React App Locally

```bash
# Clone repository
git clone https://github.com/samarthkumar096-commits/ludomax-app.git
cd ludomax-app/frontend

# Install dependencies
npm install

# Enable mock data mode
echo "REACT_APP_USE_MOCK=true" > .env

# Build for production
npm run build
```

#### Step 2: Deploy Build Folder

**Option A: Using Netlify Drop**
1. Go to https://app.netlify.com/drop
2. Drag & drop the `build` folder
3. Get your live URL (e.g., `https://ludomax-xyz.netlify.app`)

**Option B: Using Vercel**
```bash
npm install -g vercel
cd build
vercel --prod
```

#### Step 3: Convert to APK

**Using PWA Builder:**
1. Go to https://www.pwabuilder.com
2. Enter your deployed URL
3. Click "Start"
4. Click "Package for Stores"
5. Select "Android"
6. Click "Generate"
7. Download APK!

**Using AppsGeyser (Alternative):**
1. Go to https://appsgeyser.com
2. Select "Website"
3. Enter your URL
4. Customize app name and icon
5. Download APK

---

### Method 2: Using Capacitor (30 minutes) - Full Control

#### Prerequisites:
- Node.js installed
- Android Studio installed
- Java JDK 11+ installed

#### Step 1: Setup Project

```bash
cd ludomax-app/frontend

# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize Capacitor
npx cap init "LudoMax" "com.ludomax.app" --web-dir=build
```

#### Step 2: Build React App

```bash
# Enable mock data
echo "REACT_APP_USE_MOCK=true" > .env

# Build
npm run build
```

#### Step 3: Add Android Platform

```bash
# Add Android
npx cap add android

# Copy web assets
npx cap copy android
npx cap sync android
```

#### Step 4: Build APK

**Option A: Using Android Studio (Recommended)**
```bash
# Open in Android Studio
npx cap open android
```

Then in Android Studio:
1. Wait for Gradle sync to complete
2. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for build (2-5 minutes)
4. Click "locate" to find APK
5. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

**Option B: Using Command Line**
```bash
cd android
./gradlew assembleDebug

# APK will be at:
# android/app/build/outputs/apk/debug/app-debug.apk
```

#### Step 5: Install APK

**On Phone:**
1. Transfer APK to phone via USB/Email/Drive
2. Enable "Install from Unknown Sources"
3. Tap APK to install

**Using ADB:**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

### Method 3: Using Expo (15 minutes) - Easiest with CLI

```bash
# Install Expo
npm install -g expo-cli eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --profile preview

# Download APK from Expo dashboard
```

---

## 🎨 Customize App

### Add Logo:

1. Download logo from:
   - https://nyc3.digitaloceanspaces.com/bhindi-drive/files/9201bc52-98ce-4286-a069-8e7aebe6a195/2025-12-01T15-26-45-935Z-097d5ea8-nano-banana-pro_1764602805736.jpg

2. **For Capacitor:**
   - Save as `frontend/public/icon.png` (512x512)
   - Run: `npx capacitor-assets generate`

3. **For PWA Builder:**
   - Upload logo when generating APK

### Change App Name:

**Capacitor:**
Edit `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">LudoMax</string>
```

---

## ⚠️ Important Notes

### Mock Data Mode:
- ✅ App will work without backend
- ✅ Demo user with ₹500 balance
- ✅ All features visible
- ❌ No real payments
- ❌ No real multiplayer
- ❌ Data not saved

### For Production:
1. Deploy backend first (Railway)
2. Update `REACT_APP_API_URL` in `.env`
3. Set `REACT_APP_USE_MOCK=false`
4. Rebuild APK

---

## 🐛 Troubleshooting

### Android Studio Issues:

**Gradle sync failed:**
```bash
cd android
./gradlew clean
./gradlew build
```

**SDK not found:**
- Install Android SDK via Android Studio
- Set ANDROID_HOME environment variable

**Build failed:**
```bash
# Update Gradle wrapper
cd android
./gradlew wrapper --gradle-version=7.5
```

### APK not installing:

- Enable "Install from Unknown Sources"
- Check Android version (minimum: 5.0)
- Uninstall old version first

---

## 📦 APK Size Optimization

```bash
# Enable ProGuard (reduces size by 50%)
# Edit android/app/build.gradle:

buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt')
    }
}
```

---

## 🚀 Quick Commands Summary

```bash
# Full build process
cd ludomax-app/frontend
npm install
echo "REACT_APP_USE_MOCK=true" > .env
npm run build
npx cap add android
npx cap copy android
npx cap open android
# Then build in Android Studio
```

---

## 📱 Test APK

**Test on:**
- ✅ Different Android versions (5.0+)
- ✅ Different screen sizes
- ✅ With/without internet
- ✅ All features working

---

## 🎯 Recommended Approach

**For Quick Testing:**
1. Use **PWA Builder** (fastest, no setup)
2. Deploy on Netlify Drop
3. Generate APK online

**For Production:**
1. Use **Capacitor** (full control)
2. Build with Android Studio
3. Sign APK for Play Store

---

Need help? Check main docs or create GitHub issue!
